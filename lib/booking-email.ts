export function normalizeCustomerEmail(raw: string): string {
  return raw.trim();
}

/** Shown on blur / submit when the address fails a practical format check. */
export const BOOKING_EMAIL_INVALID_MESSAGE =
  "Revisa el correo: no parece una dirección de email válida.";

/** Simple, practical validation (local part, @, domain with TLD). */
export function isValidBookingEmail(raw: string): boolean {
  const t = normalizeCustomerEmail(raw);
  if (t.length < 5) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(t);
}
