const parsedReservationPaymentEur = Number(
  process.env.NEXT_PUBLIC_RESERVATION_PAYMENT_EUR ?? "600",
);

export const RESERVATION_PAYMENT_EUR =
  Number.isFinite(parsedReservationPaymentEur) && parsedReservationPaymentEur > 0
    ? parsedReservationPaymentEur
    : 600;
export const RESERVATION_PAYMENT_CENTS = Math.round(
  RESERVATION_PAYMENT_EUR * 100,
);
