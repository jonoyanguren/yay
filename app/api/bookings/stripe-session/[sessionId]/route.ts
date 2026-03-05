import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * GET /api/bookings/stripe-session/[sessionId]
 * Returns a booking by Stripe session ID (public endpoint for thank you page)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        id: true,
        status: true,
        stripeAmountTotalCents: true,
        retreatId: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let stripePaymentStatus: Stripe.Checkout.Session.PaymentStatus | null =
      null;
    let stripeAmountTotalCents: number | null = booking.stripeAmountTotalCents;

    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        stripePaymentStatus = session.payment_status;
        stripeAmountTotalCents = session.amount_total ?? stripeAmountTotalCents;
      } catch (error) {
        console.error("Error fetching Stripe session for analytics:", error);
      }
    }

    const payload = {
      ...booking,
      stripeAmountTotalCents,
      stripePaymentStatus,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching booking by session:", error);
    return NextResponse.json(
      { error: "Error fetching booking" },
      { status: 500 },
    );
  }
}
