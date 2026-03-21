import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { calculateBookingTotalCents } from "@/lib/booking-total-cents";
import {
  sendBookingConfirmationEmail,
  sendRetreatFullyPaidEmail,
} from "@/lib/email";
import { sendMetaPurchaseEvent } from "@/lib/meta-conversions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getCustomerId(session: Stripe.Checkout.Session): string | null {
  return typeof session.customer === "string" ? session.customer : null;
}

async function resolveInvoicePayerEmail(
  invoice: Stripe.Invoice,
  fallbackEmail: string,
): Promise<string> {
  const fromInvoice = invoice.customer_email?.trim();
  if (fromInvoice) return fromInvoice.toLowerCase();

  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : null;
  if (customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email?.trim()) {
        return customer.email.trim().toLowerCase();
      }
    } catch (e) {
      console.error("resolveInvoicePayerEmail: customer retrieve failed", e);
    }
  }

  return fallbackEmail.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.info("[stripe webhook] received", {
    type: event.type,
    id: event.id,
  });

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      console.error("checkout.session.completed missing metadata.bookingId");
      return NextResponse.json(
        { error: "Missing booking id in metadata" },
        { status: 400 },
      );
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          retreat: {
            select: {
              title: true,
              slug: true,
            },
          },
          roomSlots: {
            include: {
              retreatRoomType: {
                select: {
                  name: true,
                  priceCents: true,
                },
              },
            },
          },
          extras: {
            include: {
              retreatExtraActivity: {
                select: {
                  name: true,
                  priceCents: true,
                },
              },
            },
          },
        },
      });

      if (booking) {
        const totalAmount = calculateBookingTotalCents(booking);
        const chargedAmount = session.amount_total ?? 0;
        const bookingStatus = chargedAmount >= totalAmount ? "paid" : "deposit";
        const pendingAmount = Math.max(0, totalAmount - chargedAmount);

        // Update booking status and Stripe payment data
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: bookingStatus,
            stripeCustomerId: getCustomerId(session),
            stripeAmountTotalCents: session.amount_total ?? null,
            stripePaymentType: session.metadata?.paymentType ?? null,
          },
        });

        await sendMetaPurchaseEvent({
          bookingId,
          retreatId: booking.retreatId,
          chargedAmountCents: chargedAmount,
          customerEmail: booking.customerEmail,
        });

        // Send confirmation email
        await sendBookingConfirmationEmail({
          to: booking.customerEmail,
          customerName: booking.customerName || "Viajero",
          retreatTitle: booking.retreat.title,
          retreatSlug: booking.retreat.slug,
          roomType: booking.roomSlots[0]?.retreatRoomType.name || "Habitación",
          roomQuantity: booking.roomSlots[0]?.quantity || 1,
          extras: booking.extras.map((e) => ({
            name: e.retreatExtraActivity.name,
            quantity: e.quantity,
          })),
          totalAmount,
          chargedAmount,
          pendingAmount,
          bookingDate: booking.createdAt.toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating booking to paid:", bookingId, error);
    }
  }

  /**
   * Dashboard: webhook debe incluir `invoice.paid`.
   * Facturas de saldo: metadata `bookingId` = id de la reserva.
   */
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;

    console.info("[stripe webhook] invoice.paid payload", {
      invoiceId: invoice.id,
      status: invoice.status,
      amountPaid: invoice.amount_paid,
      metadata: invoice.metadata ?? {},
    });

    if (invoice.status !== "paid") {
      console.info(
        "[stripe webhook] invoice.paid skip: invoice.status !== paid",
        {
          invoiceId: invoice.id,
          status: invoice.status,
        },
      );
      return NextResponse.json({ received: true });
    }

    const invBookingId = invoice.metadata?.bookingId?.trim();
    if (!invBookingId) {
      console.info(
        "[stripe webhook] invoice.paid skip: no metadata.bookingId",
        {
          invoiceId: invoice.id,
          metadataKeys: invoice.metadata ? Object.keys(invoice.metadata) : [],
        },
      );
      return NextResponse.json({ received: true });
    }

    const invoicePaidCents = invoice.amount_paid ?? 0;
    if (invoicePaidCents <= 0) {
      console.info("[stripe webhook] invoice.paid skip: amount_paid <= 0", {
        invoiceId: invoice.id,
        amountPaid: invoicePaidCents,
      });
      return NextResponse.json({ received: true });
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: invBookingId },
        include: {
          retreat: { select: { title: true, slug: true } },
          roomSlots: {
            include: {
              retreatRoomType: { select: { name: true, priceCents: true } },
            },
          },
          extras: {
            include: {
              retreatExtraActivity: {
                select: { name: true, priceCents: true },
              },
            },
          },
        },
      });

      if (!booking) {
        console.error("[stripe webhook] invoice.paid skip: booking not found", {
          bookingId: invBookingId,
          invoiceId: invoice.id,
        });
        return NextResponse.json({ received: true });
      }

      const totalRequiredCents = calculateBookingTotalCents(booking);
      const depositCents = booking.stripeAmountTotalCents ?? 0;
      const totalPaidCents = depositCents + invoicePaidCents;
      const toleranceCents = 1;

      console.info("[stripe webhook] invoice.paid totals check", {
        bookingId: invBookingId,
        bookingStatus: booking.status,
        totalRequiredCents,
        depositCents,
        invoicePaidCents,
        totalPaidCents,
        passesTotalCheck: totalPaidCents + toleranceCents >= totalRequiredCents,
      });

      if (totalPaidCents + toleranceCents < totalRequiredCents) {
        console.warn(
          "[stripe webhook] invoice.paid skip: sum below retreat total",
          {
            bookingId: invBookingId,
            totalRequiredCents,
            depositCents,
            invoicePaidCents,
            totalPaidCents,
          },
        );
        return NextResponse.json({ received: true });
      }

      if (booking.status === "paid") {
        console.info(
          "[stripe webhook] invoice.paid skip: booking already paid (no duplicate email)",
          {
            bookingId: invBookingId,
          },
        );
        return NextResponse.json({ received: true });
      }

      await prisma.booking.update({
        where: { id: invBookingId },
        data: {
          status: "paid",
          stripeAmountTotalCents: totalPaidCents,
        },
      });

      const payerEmail = await resolveInvoicePayerEmail(
        invoice,
        booking.customerEmail,
      );

      console.info(
        "[stripe webhook] invoice.paid sending RetreatFullyPaid email",
        {
          bookingId: invBookingId,
          to: payerEmail,
          totalPaidCents,
        },
      );

      const emailResult = await sendRetreatFullyPaidEmail({
        to: payerEmail,
        customerName: booking.customerName || "Viajero",
        retreatTitle: booking.retreat.title,
        retreatSlug: booking.retreat.slug,
      });

      console.info("[stripe webhook] invoice.paid email result", {
        bookingId: invBookingId,
        success: emailResult.success,
        error: emailResult.success ? undefined : emailResult.error,
      });
    } catch (error) {
      console.error("[stripe webhook] invoice.paid handler error", {
        bookingId: invBookingId,
        error,
      });
    }
  }

  return NextResponse.json({ received: true });
}
