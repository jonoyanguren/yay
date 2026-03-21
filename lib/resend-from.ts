/**
 * Remitente por defecto si no hay RESEND_FROM_EMAIL válido.
 * Debe coincidir con un dominio/remitente verificado en Resend.
 */
export const DEFAULT_RESEND_MAILBOX = "info@yayexperiences.com";

const DEFAULT_FROM_HEADER = `YaY Experiences <${DEFAULT_RESEND_MAILBOX}>`;

/** Valores antiguos en .env / Vercel que ya no deben usarse. */
const LEGACY_FROM_PATTERN = /yogandyou\.com/i;

/** Solo dirección, sin nombre visible (ej. info@yayexperiences.com). */
const PLAIN_EMAIL_ONLY = /^[^\s<>]+@[^\s<>]+\.[^\s<>]+$/i;

export function getResendFrom(): string {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (raw && !LEGACY_FROM_PATTERN.test(raw)) {
    if (PLAIN_EMAIL_ONLY.test(raw)) {
      return `YaY Experiences <${raw}>`;
    }
    return raw;
  }
  return DEFAULT_FROM_HEADER;
}
