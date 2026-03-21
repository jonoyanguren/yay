/** Shape needed to sum room slots + extras (matches Prisma include). */
export type BookingForTotalCents = {
  roomSlots: Array<{ quantity: number; retreatRoomType: { priceCents: number } }>;
  extras: Array<{
    quantity: number;
    retreatExtraActivity: { priceCents: number };
  }>;
};

export function calculateBookingTotalCents(booking: BookingForTotalCents): number {
  const roomTotal = booking.roomSlots.reduce(
    (sum, slot) => sum + slot.retreatRoomType.priceCents * slot.quantity,
    0,
  );
  const extrasTotal = booking.extras.reduce(
    (sum, extra) => sum + extra.retreatExtraActivity.priceCents * extra.quantity,
    0,
  );
  return roomTotal + extrasTotal;
}
