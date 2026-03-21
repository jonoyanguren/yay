import {
  calculateBookingTotalCents,
  type BookingForTotalCents,
} from "@/lib/booking-total-cents";

/** Shape needed for charged/pending (admin UI, APIs). */
export type BookingForBalance = BookingForTotalCents & {
  status: string;
  stripeSessionId: string | null;
  stripeAmountTotalCents: number | null;
  retreat: {
    reservationDepositCents: number;
    chargeFullAmount?: boolean | null;
  };
};

export function getEstimatedTotalCents(booking: BookingForTotalCents): number {
  return calculateBookingTotalCents(booking);
}

export function getChargedCents(booking: BookingForBalance): number {
  if (booking.stripeAmountTotalCents != null) {
    return booking.stripeAmountTotalCents;
  }
  if (booking.status === "pending" || booking.status === "cancelled") return 0;
  const estimated = calculateBookingTotalCents(booking);
  if (!booking.stripeSessionId) return estimated;
  if (booking.retreat.chargeFullAmount ?? false) return estimated;
  return Math.min(
    booking.retreat.reservationDepositCents,
    estimated,
  );
}

export function getPendingCents(booking: BookingForBalance): number {
  return Math.max(
    0,
    calculateBookingTotalCents(booking) - getChargedCents(booking),
  );
}

export function isSoloSeñalBooking(booking: BookingForBalance): boolean {
  if (booking.status !== "deposit") return false;
  if (booking.retreat.chargeFullAmount ?? false) return false;
  if (booking.retreat.reservationDepositCents <= 0) return false;
  return getPendingCents(booking) > 0;
}

const MIN_BALANCE_INVOICE_CENTS = 50;

export function canCreateBalanceStripeInvoice(
  booking: BookingForBalance & { stripeCustomerId?: string | null },
): boolean {
  if (booking.status === "cancelled") return false;
  if (!booking.stripeCustomerId?.trim()) return false;
  return getPendingCents(booking) >= MIN_BALANCE_INVOICE_CENTS;
}

export { MIN_BALANCE_INVOICE_CENTS };
