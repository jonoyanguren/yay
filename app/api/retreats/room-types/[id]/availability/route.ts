import { NextResponse } from "next/server";
import { getRoomTypeAvailability } from "@/lib/retreat-capacity";

/**
 * GET /api/retreats/room-types/[id]/availability
 * Returns available slots for a specific room type
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomTypeId } = await params;

    const availability = await getRoomTypeAvailability(roomTypeId);
    if (!availability) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ available: availability.available });
  } catch (error) {
    console.error("Error fetching room type availability:", error);
    return NextResponse.json(
      { error: "Error fetching availability" },
      { status: 500 }
    );
  }
}
