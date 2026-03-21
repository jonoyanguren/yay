import { requireAdminAuth } from "@/lib/auth";
import {
  canCreateBalanceStripeInvoice,
  getPendingCents,
} from "@/lib/booking-balance";
import { sendBalanceInvoiceEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { clientFacingErrorMessage } from "@/lib/safe-client-error-message";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

function parseTaxRateIds(): string[] {
  const raw = process.env.STRIPE_BALANCE_INVOICE_TAX_RATE_IDS;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function listInvoicesWithBookingMetadata(
  customerId: string,
  bookingId: string,
  status: Stripe.Invoice.Status,
): Promise<Stripe.Invoice[]> {
  if (!stripe) return [];
  const out: Stripe.Invoice[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const page = await stripe.invoices.list({
      customer: customerId,
      status,
      limit: 100,
      starting_after: startingAfter,
    });
    for (const inv of page.data) {
      if (inv.metadata?.bookingId === bookingId) out.push(inv);
    }
    if (!page.has_more) break;
    const last = page.data[page.data.length - 1]?.id;
    if (!last) break;
    startingAfter = last;
  }
  return out;
}

type BookingForNotify = {
  customerEmail: string;
  customerName: string | null;
  retreat: { title: string };
};

async function sendBalancePayLinkEmail(args: {
  booking: BookingForNotify;
  invoice: Stripe.Invoice;
  amountCents: number;
}): Promise<{ emailSent: boolean; emailError?: string }> {
  const { booking, invoice, amountCents } = args;
  let inv = invoice;
  if (!inv.hosted_invoice_url) {
    inv = await stripe!.invoices.retrieve(invoice.id);
  }
  const url = inv.hosted_invoice_url;
  if (!url) {
    console.error("[stripe-balance-invoice] missing hosted_invoice_url", invoice.id);
    return { emailSent: false, emailError: "Stripe no devolvió enlace de pago" };
  }

  const result = await sendBalanceInvoiceEmail({
    to: booking.customerEmail.trim(),
    customerName: booking.customerName || "Viajero",
    retreatTitle: booking.retreat.title,
    amountPendingCents: amountCents,
    payInvoiceUrl: url,
  });

  if (!result.success) {
    const err =
      typeof result.error === "string"
        ? result.error
        : result.error instanceof Error
          ? result.error.message
          : "Resend error";
    return { emailSent: false, emailError: err };
  }
  return { emailSent: true };
}

async function markBalanceInvoiceEmailed(
  bookingId: string,
  stripeInvoiceId: string,
) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      balanceInvoiceSentAt: new Date(),
      balanceInvoiceStripeId: stripeInvoiceId,
    },
    select: {
      balanceInvoiceSentAt: true,
      balanceInvoiceStripeId: true,
    },
  });
}

/**
 * POST /api/admin/bookings/[id]/stripe-balance-invoice
 * Creates (or reuses) a Stripe invoice for the remaining balance.
 * Does not use Stripe’s customer email: we only email via Resend with hosted_invoice_url.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(request, "bookings:write");
  if (auth instanceof Response) return auth;

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe no configurado" },
      { status: 500 },
    );
  }

  try {
    const { id: bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        retreat: {
          select: {
            title: true,
            reservationDepositCents: true,
            chargeFullAmount: true,
          },
        },
        roomSlots: {
          include: {
            retreatRoomType: {
              select: { name: true, priceCents: true },
            },
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
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    if (!canCreateBalanceStripeInvoice(booking)) {
      return NextResponse.json(
        {
          error:
            "No se puede crear la factura: sin cliente Stripe, cancelada, o sin saldo pendiente",
        },
        { status: 400 },
      );
    }

    const pendingCents = getPendingCents(booking);
    const customerId = booking.stripeCustomerId!;

    const openForBooking = await listInvoicesWithBookingMetadata(
      customerId,
      bookingId,
      "open",
    );
    const openWithDue = openForBooking.find(
      (inv) => (inv.amount_remaining ?? 0) > 0,
    );
    if (openWithDue) {
      const inv = await stripe.invoices.retrieve(openWithDue.id);
      const amountCents =
        inv.amount_remaining ?? openWithDue.amount_remaining ?? pendingCents;
      const { emailSent, emailError } = await sendBalancePayLinkEmail({
        booking,
        invoice: inv,
        amountCents,
      });
      let balanceInvoiceSentAt: string | undefined;
      let balanceInvoiceStripeId: string | undefined;
      if (emailSent) {
        const saved = await markBalanceInvoiceEmailed(bookingId, inv.id);
        balanceInvoiceSentAt = saved.balanceInvoiceSentAt!.toISOString();
        balanceInvoiceStripeId = saved.balanceInvoiceStripeId ?? undefined;
      }
      return NextResponse.json({
        reused: true,
        invoiceId: inv.id,
        hostedInvoiceUrl: inv.hosted_invoice_url ?? openWithDue.hosted_invoice_url,
        amountCents,
        emailSent,
        ...(balanceInvoiceSentAt
          ? { balanceInvoiceSentAt, balanceInvoiceStripeId }
          : {}),
        ...(emailError ? { emailError } : {}),
      });
    }

    const drafts = await listInvoicesWithBookingMetadata(
      customerId,
      bookingId,
      "draft",
    );
    for (const d of drafts) {
      try {
        await stripe.invoices.del(d.id);
      } catch (e) {
        console.error("[stripe-balance-invoice] failed to delete draft", d.id, e);
      }
    }

    const taxRates = parseTaxRateIds();
    const description = `Saldo — ${booking.retreat.title}`;

    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 14,
      metadata: { bookingId },
      auto_advance: false,
    });

    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      amount: pendingCents,
      currency: "eur",
      description,
      ...(taxRates.length > 0 ? { tax_rates: taxRates } : {}),
    });

    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
    const amountCents =
      finalized.amount_remaining ?? pendingCents;
    const { emailSent, emailError } = await sendBalancePayLinkEmail({
      booking,
      invoice: finalized,
      amountCents,
    });

    let balanceInvoiceSentAt: string | undefined;
    let balanceInvoiceStripeId: string | undefined;
    if (emailSent) {
      const saved = await markBalanceInvoiceEmailed(bookingId, finalized.id);
      balanceInvoiceSentAt = saved.balanceInvoiceSentAt!.toISOString();
      balanceInvoiceStripeId = saved.balanceInvoiceStripeId ?? undefined;
    }

    return NextResponse.json({
      reused: false,
      invoiceId: finalized.id,
      hostedInvoiceUrl: finalized.hosted_invoice_url,
      amountCents,
      emailSent,
      ...(balanceInvoiceSentAt
        ? { balanceInvoiceSentAt, balanceInvoiceStripeId }
        : {}),
      ...(emailError ? { emailError } : {}),
    });
  } catch (error) {
    console.error("[stripe-balance-invoice]", error);
    return NextResponse.json(
      {
        error: clientFacingErrorMessage(
          error,
          "No se pudo crear o enviar la factura de saldo.",
        ),
      },
      { status: 500 },
    );
  }
}
