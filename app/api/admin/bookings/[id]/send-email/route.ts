import { requireAdminAuth } from "@/lib/auth";
import { getChargedCents, getPendingCents } from "@/lib/booking-balance";
import { calculateBookingTotalCents } from "@/lib/booking-total-cents";
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
  const auth = await requireAdminAuth(request, "bookings:write");
  if (auth instanceof Response) return auth;

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
            reservationDepositCents: true,
            chargeFullAmount: true,
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

    const totalAmount = calculateBookingTotalCents(booking);
    const chargedAmount = getChargedCents(booking);
    const pendingAmount = getPendingCents(booking);

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
      chargedAmount,
      pendingAmount,
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
