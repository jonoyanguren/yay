import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RoomTypeWithSold = {
  id: string;
  retreat_id: string;
  name: string;
  price_cents: number;
  max_quantity: number;
  sold: number | string;
};

function toNumber(v: number | string): number {
  return typeof v === "number" ? v : parseInt(String(v), 10) || 0;
}

/**
 * GET /api/retreats/[slug]/availability
 * Returns room types with availability for a retreat by slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // First get the retreat ID from slug
    const retreat = await prisma.retreat.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!retreat) {
      return NextResponse.json(
        { error: "Retreat not found" },
        { status: 404 }
      );
    }
    
    const rows = await prisma.$queryRaw<RoomTypeWithSold[]>`
      SELECT r.id, r.retreat_id, r.name, r.price_cents, r.max_quantity,
             COALESCE(SUM(brs.quantity) FILTER (WHERE b.status = 'paid'), 0)::int AS sold
      FROM retreat_room_types r
      LEFT JOIN booking_room_slots brs ON brs.retreat_room_type_id = r.id
      LEFT JOIN bookings b ON b.id = brs.booking_id
      WHERE r.retreat_id = ${retreat.id}
      GROUP BY r.id, r.retreat_id, r.name, r.price_cents, r.max_quantity
      ORDER BY r.price_cents ASC
    `;
    
    const roomTypes = rows.map((row: RoomTypeWithSold) => ({
      id: row.id,
      retreat_id: row.retreat_id,
      name: row.name,
      price_cents: row.price_cents,
      max_quantity: row.max_quantity,
      available: Math.max(0, row.max_quantity - toNumber(row.sold)),
    }));

    return NextResponse.json(roomTypes);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Error fetching availability" },
      { status: 500 }
    );
  }
}
