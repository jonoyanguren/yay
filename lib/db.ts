import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Re-export revalidateTag for convenience */
export { revalidateTag } from "next/cache";

// ─── Types ─────────────────────────────────────────────────────────────────

export type RetreatRoomTypeRow = {
  id: string;
  retreat_id: string;
  name: string;
  price_cents: number;
  max_quantity: number;
};

export type RetreatExtraActivityRow = {
  id: string;
  retreat_id: string;
  name: string;
  price_cents: number;
  allow_multiple: boolean;
  max_quantity: number | null;
};

export type RetreatRoomTypeWithAvailability = RetreatRoomTypeRow & {
  available: number;
};

export type BookingInsert = {
  retreatId: string;
  stripeSessionId: string | null;
  customerEmail: string;
  customerName: string | null;
  status: "pending" | "paid" | "cancelled";
};

export type BookingRoomSlotInsert = {
  bookingId: string;
  retreatRoomTypeId: string;
  quantity: number;
};

export type BookingExtraInsert = {
  bookingId: string;
  retreatExtraActivityId: string;
  quantity: number;
};

// ─── Pricing & availability ─────────────────────────────────────────────────

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

/** Room types with availability for a retreat (single query, no N+1). */
export const getRoomTypesWithAvailability = cache(
  async (retreatId: string): Promise<RetreatRoomTypeWithAvailability[]> => {
    const rows = await prisma.$queryRaw<RoomTypeWithSold[]>`
      SELECT r.id, r.retreat_id, r.name, r.price_cents, r.max_quantity,
             COALESCE(SUM(brs.quantity) FILTER (WHERE b.status = 'paid'), 0)::int AS sold
      FROM retreat_room_types r
      LEFT JOIN booking_room_slots brs ON brs.retreat_room_type_id = r.id
      LEFT JOIN bookings b ON b.id = brs.booking_id
      WHERE r.retreat_id = ${retreatId}
      GROUP BY r.id, r.retreat_id, r.name, r.price_cents, r.max_quantity
      ORDER BY r.price_cents ASC
    `;
    return rows.map((row: RoomTypeWithSold) => ({
      id: row.id,
      retreat_id: row.retreat_id,
      name: row.name,
      price_cents: row.price_cents,
      max_quantity: row.max_quantity,
      available: Math.max(0, row.max_quantity - toNumber(row.sold)),
    }));
  }
);

/** Extra activities for a retreat. */
export const getExtraActivities = cache(
  async (retreatId: string): Promise<RetreatExtraActivityRow[]> => {
    const rows = await prisma.retreatExtraActivity.findMany({
      where: { retreatId },
      orderBy: { priceCents: "asc" },
    });
    return rows.map((r) => ({
      id: r.id,
      retreat_id: r.retreatId,
      name: r.name,
      price_cents: r.priceCents,
      allow_multiple: "allowMultiple" in r ? (r as { allowMultiple: boolean }).allowMultiple : true,
      max_quantity: (r as { maxQuantity: number | null }).maxQuantity ?? null,
    }));
  }
);

/** Available slots for a room type (used during checkout). */
export async function getAvailableForRoomType(
  roomTypeId: string
): Promise<number> {
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
  if (!rows[0]) return 0;
  const sold = parseInt(rows[0].sold, 10);
  return Math.max(0, rows[0].max_quantity - sold);
}

// ─── Bookings (mutations; no cache) ────────────────────────────────────────

export async function createBooking(data: BookingInsert): Promise<string> {
  const booking = await prisma.booking.create({
    data: {
      retreatId: data.retreatId,
      stripeSessionId: data.stripeSessionId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      status: data.status,
    },
  });
  return booking.id;
}

export async function addBookingRoomSlots(
  slots: BookingRoomSlotInsert[]
): Promise<void> {
  if (slots.length === 0) return;
  await prisma.bookingRoomSlot.createMany({
    data: slots.map((s) => ({
      bookingId: s.bookingId,
      retreatRoomTypeId: s.retreatRoomTypeId,
      quantity: s.quantity,
    })),
  });
}

export async function addBookingExtras(
  extras: BookingExtraInsert[]
): Promise<void> {
  const data = extras
    .filter((e) => e.quantity > 0)
    .map((e) => ({
      bookingId: e.bookingId,
      retreatExtraActivityId: e.retreatExtraActivityId,
      quantity: e.quantity,
    }));
  if (data.length === 0) return;
  await prisma.bookingExtra.createMany({ data });
}

export async function setBookingPaid(bookingId: string): Promise<boolean> {
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "paid" },
  });
  return true;
}

export async function getBookingByStripeSessionId(
  stripeSessionId: string
): Promise<{ id: string; status: string } | null> {
  const b = await prisma.booking.findUnique({
    where: { stripeSessionId },
    select: { id: true, status: true },
  });
  return b ?? null;
}
