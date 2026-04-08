import {
  BalanceInvoiceEmail,
  BookingConfirmationEmail,
  RetreatFullyPaidEmail,
  WaitlistJoinedEmail,
} from "@/lib/email-templates";
import type { WaitlistAlternativeRetreat } from "@/lib/email-templates";
import type { EmailTemplateId } from "@/lib/email-templates-meta";

function baseUrl(): string {
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

const SAMPLE_ALTERNATIVES: WaitlistAlternativeRetreat[] = [
  {
    title: "Retiro de ejemplo — Costa",
    slug: "ejemplo-costa",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    title: "Retiro de ejemplo — Montaña",
    slug: "ejemplo-montana",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
];

export function renderEmailTemplateHtml(id: EmailTemplateId): string {
  const b = baseUrl();
  switch (id) {
    case "booking_confirmation":
      return BookingConfirmationEmail({
        customerName: "Alex (prueba)",
        retreatTitle: "Sahara Calm · vista previa",
        retreatSlug: "sahara-calm",
        roomType: "Habitación en hotel",
        roomQuantity: 1,
        extras: [{ name: "Sesión de fotos en las dunas", quantity: 1 }],
        totalAmount: 200_000,
        chargedAmount: 50_000,
        pendingAmount: 150_000,
        bookingDate: new Date().toISOString(),
        baseUrl: b,
      });
    case "waitlist_joined":
      return WaitlistJoinedEmail({
        retreatTitle: "Retiro lleno · vista previa",
        retreatSlug: "retiro-lleno",
        baseUrl: b,
        alternativeRetreats: SAMPLE_ALTERNATIVES,
      });
    case "retreat_fully_paid":
      return RetreatFullyPaidEmail({
        customerName: "Alex (prueba)",
        retreatTitle: "Sahara Calm · vista previa",
        retreatSlug: "sahara-calm",
        baseUrl: b,
      });
    case "balance_invoice":
      return BalanceInvoiceEmail({
        customerName: "Alex (prueba)",
        retreatTitle: "Sahara Calm · vista previa",
        amountPendingCents: 150_000,
        payInvoiceUrl:
          "https://invoice.stripe.com/i/acct_ejemplo/ejemplo_vista_previa",
        baseUrl: b,
      });
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function emailTemplateTestSubject(id: EmailTemplateId): string {
  switch (id) {
    case "booking_confirmation":
      return "[PRUEBA] ✓ Reserva confirmada: Sahara Calm · vista previa";
    case "waitlist_joined":
      return "[PRUEBA] Lista de espera: Retiro lleno · vista previa";
    case "retreat_fully_paid":
      return "[PRUEBA] ¡Listo! Pago completado: Sahara Calm · vista previa";
    case "balance_invoice":
      return "[PRUEBA] Pago pendiente — Sahara Calm · vista previa";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

