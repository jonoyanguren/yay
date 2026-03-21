import { Resend } from "resend";
import type { WaitlistAlternativeRetreat } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export function getEmailBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/** Absolute URL for images/links in emails (supports relative paths). */
export function absoluteUrlForEmail(pathOrUrl: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const raw = pathOrUrl?.trim();
  if (!raw) return `${base}/assets/placeholder.jpg`;
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

interface SendBookingConfirmationParams {
  to: string;
  customerName: string;
  retreatTitle: string;
  retreatSlug: string;
  roomType: string;
  roomQuantity: number;
  extras: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  chargedAmount: number;
  pendingAmount: number;
  bookingDate: string;
}

export async function sendBookingConfirmationEmail({
  to,
  customerName,
  retreatTitle,
  retreatSlug,
  roomType,
  roomQuantity,
  extras,
  totalAmount,
  chargedAmount,
  pendingAmount,
  bookingDate,
}: SendBookingConfirmationParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  const { BookingConfirmationEmail } = await import("./email-templates");

  const html = BookingConfirmationEmail({
    customerName,
    retreatTitle,
    retreatSlug,
    roomType,
    roomQuantity,
    extras,
    totalAmount,
    chargedAmount,
    pendingAmount,
    bookingDate,
    baseUrl: getEmailBaseUrl(),
  });

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject: `✓ Reserva confirmada: ${retreatTitle}`,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

interface SendWaitlistJoinedParams {
  to: string;
  retreatTitle: string;
  retreatSlug: string;
  alternativeRetreats: WaitlistAlternativeRetreat[];
}

export async function sendWaitlistJoinedEmail({
  to,
  retreatTitle,
  retreatSlug,
  alternativeRetreats,
}: SendWaitlistJoinedParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  const { WaitlistJoinedEmail } = await import("./email-templates");

  const html = WaitlistJoinedEmail({
    retreatTitle,
    retreatSlug,
    baseUrl: getEmailBaseUrl(),
    alternativeRetreats,
  });

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject: `Lista de espera: ${retreatTitle}`,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending waitlist email:", error);
    return { success: false, error };
  }
}
