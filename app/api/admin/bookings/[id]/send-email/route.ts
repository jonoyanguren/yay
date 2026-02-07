import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/email";

/**
 * POST /api/admin/bookings/[id]/send-email
 * Sends or resends confirmation email for a booking
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    // Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Calculate total
    let totalAmount = 0;
    booking.roomSlots.forEach((slot) => {
      totalAmount += slot.retreatRoomType.priceCents * slot.quantity;
    });
    booking.extras.forEach((extra) => {
      totalAmount += extra.retreatExtraActivity.priceCents * extra.quantity;
    });

    // Send confirmation email
    const result = await sendBookingConfirmationEmail({
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
      bookingDate: booking.createdAt.toISOString(),
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending booking email:", error);
    return NextResponse.json(
      { error: "Error sending email" },
      { status: 500 }
    );
  }
}
