export const EMAIL_TEMPLATE_IDS = [
  "booking_confirmation",
  "waitlist_joined",
  "retreat_fully_paid",
  "balance_invoice",
] as const;

export type EmailTemplateId = (typeof EMAIL_TEMPLATE_IDS)[number];

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateId, string> = {
  booking_confirmation: "Confirmación de reserva",
  waitlist_joined: "Lista de espera",
  retreat_fully_paid: "Retiro pagado al completo",
  balance_invoice: "Factura de saldo (enlace de pago)",
};

export function isEmailTemplateId(s: string): s is EmailTemplateId {
  return (EMAIL_TEMPLATE_IDS as readonly string[]).includes(s);
}
