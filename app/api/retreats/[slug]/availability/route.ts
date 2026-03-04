import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getRoomTypesWithAvailability } from "@/lib/retreat-capacity";

/**
 * GET /api/retreats/[slug]/availability
 * Returns room types with availability for a retreat by slug
 */
export async function GET(
  _request: Request,
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
    
    const roomTypes = await getRoomTypesWithAvailability(retreat.id);

    return NextResponse.json(roomTypes);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Error fetching availability" },
      { status: 500 }
    );
  }
}
