import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/email";

/**
 * GET /api/admin/bookings
 * Returns all bookings with related data
 */
export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        retreat: {
          select: {
            id: true,
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

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error fetching bookings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/bookings
 * Creates a new booking manually
 */
export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const data = await request.json();
    const {
      retreatId,
      customerEmail,
      customerName,
      roomTypeId,
      roomQuantity,
      extras,
      status,
    } = data;

    if (!retreatId || !customerEmail || !roomTypeId || !roomQuantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        retreatId,
        customerEmail: customerEmail.trim(),
        customerName: customerName?.trim() || null,
        status: status || "paid",
        stripeSessionId: null,
      },
    });

    // Add room slots
    await prisma.bookingRoomSlot.create({
      data: {
        bookingId: booking.id,
        retreatRoomTypeId: roomTypeId,
        quantity: roomQuantity,
      },
    });

    // Add extras if any
    if (extras && extras.length > 0) {
      const extraData = extras
        .filter((e: any) => e.quantity > 0)
        .map((e: any) => ({
          bookingId: booking.id,
          retreatExtraActivityId: e.id,
          quantity: e.quantity,
        }));
      
      if (extraData.length > 0) {
        await prisma.bookingExtra.createMany({ data: extraData });
      }
    }

    // Fetch the created booking with all relations
    const createdBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        retreat: {
          select: {
            id: true,
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

    // Send confirmation email if booking is paid
    if (createdBooking && (status === "paid" || !status)) {
      // Calculate total
      let totalAmount = 0;
      createdBooking.roomSlots.forEach((slot) => {
        totalAmount += slot.retreatRoomType.priceCents * slot.quantity;
      });
      createdBooking.extras.forEach((extra) => {
        totalAmount += extra.retreatExtraActivity.priceCents * extra.quantity;
      });

      // Send email (don't await - fire and forget)
      sendBookingConfirmationEmail({
        to: createdBooking.customerEmail,
        customerName: createdBooking.customerName || "Viajero",
        retreatTitle: createdBooking.retreat.title,
        retreatSlug: createdBooking.retreat.slug,
        roomType: createdBooking.roomSlots[0]?.retreatRoomType.name || "Habitación",
        roomQuantity: createdBooking.roomSlots[0]?.quantity || 1,
        extras: createdBooking.extras.map((e) => ({
          name: e.retreatExtraActivity.name,
          quantity: e.quantity,
        })),
        totalAmount,
        bookingDate: createdBooking.createdAt.toISOString(),
      }).catch(err => console.error("Error sending email:", err));
    }

    return NextResponse.json(createdBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Error creating booking" },
      { status: 500 }
    );
  }
}
