import { Resend } from "resend";
import type { WaitlistAlternativeRetreat } from "@/lib/email-templates";
import { getResendFrom } from "@/lib/resend-from";

const resend = new Resend(process.env.RESEND_API_KEY);

export function getEmailBaseUrl(): string {
  const configured =
    process.env.EMAIL_ASSETS_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const rawBaseUrl =
    configured || (vercelHost ? `https://${vercelHost}` : "https://yayexperiences.com");
  const normalizedBaseUrl = /^https?:\/\//i.test(rawBaseUrl)
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;

  return normalizedBaseUrl.replace(/\/$/, "");
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
      from: getResendFrom(),
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
      from: getResendFrom(),
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

interface SendRetreatFullyPaidParams {
  to: string;
  customerName: string;
  retreatTitle: string;
  retreatSlug: string;
}

interface SendBalanceInvoiceEmailParams {
  to: string;
  customerName: string;
  retreatTitle: string;
  amountPendingCents: number;
  payInvoiceUrl: string;
}

export async function sendBalanceInvoiceEmail({
  to,
  customerName,
  retreatTitle,
  amountPendingCents,
  payInvoiceUrl,
}: SendBalanceInvoiceEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  if (!payInvoiceUrl?.trim()) {
    return { success: false, error: "Missing invoice pay URL" };
  }

  const { BalanceInvoiceEmail } = await import("./email-templates");

  const html = BalanceInvoiceEmail({
    customerName,
    retreatTitle,
    amountPendingCents,
    payInvoiceUrl: payInvoiceUrl.trim(),
    baseUrl: getEmailBaseUrl(),
  });

  try {
    const data = await resend.emails.send({
      from: getResendFrom(),
      to: [to],
      subject: `Pago pendiente — ${retreatTitle}`,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending balance invoice email:", error);
    return { success: false, error };
  }
}

export async function sendRetreatFullyPaidEmail({
  to,
  customerName,
  retreatTitle,
  retreatSlug,
}: SendRetreatFullyPaidParams) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  const { RetreatFullyPaidEmail } = await import("./email-templates");

  const html = RetreatFullyPaidEmail({
    customerName,
    retreatTitle,
    retreatSlug,
    baseUrl: getEmailBaseUrl(),
  });

  try {
    const data = await resend.emails.send({
      from: getResendFrom(),
      to: [to],
      subject: `¡Listo! Pago completado: ${retreatTitle}`,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending fully paid email:", error);
    return { success: false, error };
  }
}
