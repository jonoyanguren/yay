import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendBookingConfirmationParams {
  to: string;
  customerName: string;
  retreatTitle: string;
  retreatSlug: string;
  roomType: string;
  roomQuantity: number;
  extras: Array<{ name: string; quantity: number }>;
  totalAmount: number;
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
    bookingDate,
  });

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject: `✓ Reserva confirmada: ${retreatTitle}`,
      html,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
