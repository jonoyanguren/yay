import { prisma } from "@/lib/prisma";

const PAID_REGISTRATION_STATUS = "paid" as const;

export async function getEventSoldCount(eventId: string): Promise<number> {
  return prisma.eventRegistration.count({
    where: { eventId, status: PAID_REGISTRATION_STATUS },
  });
}

export async function getEventCapacity(eventId: string): Promise<{
  maxAttendees: number;
  spotsLeft: number;
  isSoldOut: boolean;
}> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { maxAttendees: true, forceSoldOut: true },
  });

  if (!event) {
    return { maxAttendees: 0, spotsLeft: 0, isSoldOut: true };
  }

  const sold = await getEventSoldCount(eventId);
  const spotsLeft = Math.max(0, event.maxAttendees - sold);
  const isSoldOut = event.forceSoldOut || spotsLeft <= 0;

  return {
    maxAttendees: event.maxAttendees,
    spotsLeft,
    isSoldOut,
  };
}

export async function getEventSpotsLeftMap(
  eventIds: string[],
): Promise<Map<string, number>> {
  if (eventIds.length === 0) return new Map();

  const events = await prisma.event.findMany({
    where: { id: { in: eventIds } },
    select: { id: true, maxAttendees: true, forceSoldOut: true },
  });

  const soldRows = await prisma.eventRegistration.groupBy({
    by: ["eventId"],
    where: {
      eventId: { in: eventIds },
      status: PAID_REGISTRATION_STATUS,
    },
    _count: { _all: true },
  });

  const soldByEvent = new Map(
    soldRows.map((row) => [row.eventId, row._count._all]),
  );

  const result = new Map<string, number>();
  for (const event of events) {
    const sold = soldByEvent.get(event.id) ?? 0;
    const spotsLeft = event.forceSoldOut
      ? 0
      : Math.max(0, event.maxAttendees - sold);
    result.set(event.id, spotsLeft);
  }

  return result;
}
