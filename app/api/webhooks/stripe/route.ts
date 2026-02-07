import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      console.error("checkout.session.completed missing metadata.bookingId");
      return NextResponse.json(
        { error: "Missing booking id in metadata" },
        { status: 400 }
      );
    }
    
    try {
      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "paid" },
      });

      // Fetch booking details for email
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
        // Calculate total
        let totalAmount = 0;
        booking.roomSlots.forEach(slot => {
          totalAmount += slot.retreatRoomType.priceCents * slot.quantity;
        });
        booking.extras.forEach(extra => {
          totalAmount += extra.retreatExtraActivity.priceCents * extra.quantity;
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
          bookingDate: booking.createdAt.toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating booking to paid:", bookingId, error);
    }
  }

  return NextResponse.json({ received: true });
}
