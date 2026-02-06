import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/bookings/stripe-session/[sessionId]
 * Returns a booking by Stripe session ID (public endpoint for thank you page)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    const booking = await prisma.booking.findUnique({
      where: { stripeSessionId: sessionId },
      select: { 
        id: true, 
        status: true,
        customerEmail: true,
        customerName: true,
        retreat: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking by session:", error);
    return NextResponse.json(
      { error: "Error fetching booking" },
      { status: 500 }
    );
  }
}
