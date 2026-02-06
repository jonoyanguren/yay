import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/bookings/[id]
 * Returns a single booking by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Error fetching booking" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/bookings/[id]
 * Updates a booking (mainly status)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: any = {};
    
    if (data.status !== undefined) {
      if (!["pending", "paid", "cancelled"].includes(data.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = data.status;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error updating booking:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error updating booking" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/bookings/[id]
 * Deletes a booking
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    
    // Delete related records first due to foreign key constraints
    await prisma.$transaction([
      prisma.bookingExtra.deleteMany({
        where: { bookingId: id },
      }),
      prisma.bookingRoomSlot.deleteMany({
        where: { bookingId: id },
      }),
      prisma.booking.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error deleting booking" },
      { status: 500 }
    );
  }
}
