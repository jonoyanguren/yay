import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getCustomerId(session: Stripe.Checkout.Session): string | null {
  return typeof session.customer === "string" ? session.customer : null;
}

function calculateBookingTotalCents(booking: {
  roomSlots: Array<{ quantity: number; retreatRoomType: { priceCents: number } }>;
  extras: Array<{
    quantity: number;
    retreatExtraActivity: { priceCents: number };
  }>;
}): number {
  const roomTotal = booking.roomSlots.reduce(
    (sum, slot) => sum + slot.retreatRoomType.priceCents * slot.quantity,
    0,
  );
  const extrasTotal = booking.extras.reduce(
    (sum, extra) => sum + extra.retreatExtraActivity.priceCents * extra.quantity,
    0,
  );
  return roomTotal + extrasTotal;
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
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
        { status: 400 }
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

        // Send confirmation email
        await sendBookingConfirmationEmail({
          to: booking.customerEmail,
          customerName: booking.customerName || "Viajero",
          retreatTitle: booking.retreat.title,
          retreatSlug: booking.retreat.slug,
          roomType: booking.roomSlots[0]?.retreatRoomType.name || "Habitación",
          roomQuantity: booking.roomSlots[0]?.quantity || 1,
          extras: booking.extras.map(e => ({
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

  return NextResponse.json({ received: true });
}
