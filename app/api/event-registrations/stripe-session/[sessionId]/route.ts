import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;

    const registration = await prisma.eventRegistration.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        id: true,
        status: true,
        stripeAmountTotalCents: true,
        eventId: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    let stripePaymentStatus: Stripe.Checkout.Session.PaymentStatus | null = null;
    let stripeAmountTotalCents: number | null =
      registration.stripeAmountTotalCents;

    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        stripePaymentStatus = session.payment_status;
        stripeAmountTotalCents = session.amount_total ?? stripeAmountTotalCents;
      } catch (error) {
        console.error("Error fetching Stripe session for event:", error);
      }
    }

    return NextResponse.json({
      ...registration,
      stripeAmountTotalCents,
      stripePaymentStatus,
    });
  } catch (error) {
    console.error("Error fetching event registration by session:", error);
    return NextResponse.json(
      { error: "Error fetching registration" },
      { status: 500 },
    );
  }
}
