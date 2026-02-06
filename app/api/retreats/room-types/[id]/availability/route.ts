import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/retreats/room-types/[id]/availability
 * Returns available slots for a specific room type
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomTypeId } = await params;
    
    const rows = await prisma.$queryRaw<{ max_quantity: number; sold: string }[]>`
      SELECT r.max_quantity,
             COALESCE(SUM(brs.quantity) FILTER (WHERE b.status = 'paid'), 0)::text AS sold
      FROM retreat_room_types r
      LEFT JOIN booking_room_slots brs ON brs.retreat_room_type_id = r.id
      LEFT JOIN bookings b ON b.id = brs.booking_id
      WHERE r.id = ${roomTypeId}
      GROUP BY r.id, r.max_quantity
      LIMIT 1
    `;
    
    if (!rows[0]) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }
    
    const sold = parseInt(rows[0].sold, 10);
    const available = Math.max(0, rows[0].max_quantity - sold);

    return NextResponse.json({ available });
  } catch (error) {
    console.error("Error fetching room type availability:", error);
    return NextResponse.json(
      { error: "Error fetching availability" },
      { status: 500 }
    );
  }
}
