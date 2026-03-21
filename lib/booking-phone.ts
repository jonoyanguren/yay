/** Trim and collapse internal spaces (keep + and separators user typed). */
export function normalizeCustomerPhone(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/** Shown on blur / submit when the number fails validation (missing +, incomplete, etc.). */
export const BOOKING_PHONE_INVALID_MESSAGE =
  "Revisa el teléfono: incluye + y el prefijo de país. En España son +34 y 9 dígitos más (11 cifras en total).";

/**
 * Leading + required. Digits only (no +) must be E.164-style length.
 * Spain (+34): exactly 9 national digits → 11 digits total (34 + xxxxxxxxx).
 * Other countries: 10–15 digits total (ITU maximum).
 */
export function isValidBookingPhone(raw: string): boolean {
  const t = normalizeCustomerPhone(raw);
  if (!t.startsWith("+")) return false;
  const digits = t.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return false;
  if (digits.startsWith("34")) {
    return digits.length === 11;
  }
  return true;
}
