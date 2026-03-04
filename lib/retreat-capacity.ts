import { prisma } from "@/lib/prisma";
import type { RetreatRoomTypeWithAvailability } from "@/lib/types";

const PAID_BOOKING_STATUSES = ["deposit", "paid"] as const;

async function getSoldByRoomTypeIds(roomTypeIds: string[]): Promise<Map<string, number>> {
  if (roomTypeIds.length === 0) {
    return new Map<string, number>();
  }

  const soldRows = await prisma.bookingRoomSlot.groupBy({
    by: ["retreatRoomTypeId"],
    where: {
      retreatRoomTypeId: { in: roomTypeIds },
      booking: { status: { in: [...PAID_BOOKING_STATUSES] } },
    },
    _sum: { quantity: true },
  });

  return new Map(
    soldRows.map((row) => [row.retreatRoomTypeId, row._sum.quantity ?? 0]),
  );
}

export async function getRoomTypeAvailability(roomTypeId: string): Promise<{
  maxPeople: number;
  sold: number;
  available: number;
} | null> {
  const roomType = await prisma.retreatRoomType.findUnique({
    where: { id: roomTypeId },
    select: { id: true, maxPeople: true },
  });

  if (!roomType) {
    return null;
  }

  const soldByRoom = await getSoldByRoomTypeIds([roomTypeId]);
  const sold = soldByRoom.get(roomTypeId) ?? 0;

  return {
    maxPeople: roomType.maxPeople,
    sold,
    available: Math.max(0, roomType.maxPeople - sold),
  };
}

export async function getRoomTypesWithAvailability(
  retreatId: string,
): Promise<RetreatRoomTypeWithAvailability[]> {
  const roomTypes = await prisma.retreatRoomType.findMany({
    where: { retreatId },
    orderBy: { priceCents: "asc" },
  });
  const soldByRoom = await getSoldByRoomTypeIds(roomTypes.map((room) => room.id));

  return roomTypes.map((room) => {
    const sold = soldByRoom.get(room.id) ?? 0;
    return {
      id: room.id,
      retreat_id: room.retreatId,
      name: room.name,
      description: room.description ?? "",
      images: room.images || [],
      price_cents: room.priceCents,
      max_people: room.maxPeople,
      available: Math.max(0, room.maxPeople - sold),
    };
  });
}

export async function getRetreatCapacity(retreatId: string): Promise<{
  maxPeople: number;
  spotsLeft: number;
  isSoldOut: boolean;
}> {
  const roomTypes = await getRoomTypesWithAvailability(retreatId);
  const maxPeople = roomTypes.reduce((sum, room) => sum + room.max_people, 0);
  const spotsLeft = roomTypes.reduce((sum, room) => sum + room.available, 0);
  const isSoldOut = roomTypes.length > 0 && spotsLeft <= 0;

  return { maxPeople, spotsLeft, isSoldOut };
}

export async function getRetreatSpotsLeftMap(
  retreatIds: string[],
): Promise<Map<string, number>> {
  if (retreatIds.length === 0) {
    return new Map<string, number>();
  }

  const roomTypes = await prisma.retreatRoomType.findMany({
    where: { retreatId: { in: retreatIds } },
    select: { id: true, retreatId: true, maxPeople: true },
  });
  const soldByRoom = await getSoldByRoomTypeIds(roomTypes.map((room) => room.id));
  const spotsLeftByRetreat = new Map<string, number>();

  for (const room of roomTypes) {
    const sold = soldByRoom.get(room.id) ?? 0;
    const available = Math.max(0, room.maxPeople - sold);
    spotsLeftByRetreat.set(
      room.retreatId,
      (spotsLeftByRetreat.get(room.retreatId) ?? 0) + available,
    );
  }

  return spotsLeftByRetreat;
}
