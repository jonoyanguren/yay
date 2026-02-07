interface BookingConfirmationEmailProps {
  customerName: string;
  retreatTitle: string;
  retreatSlug: string;
  roomType: string;
  roomQuantity: number;
  extras: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  bookingDate: string;
}

export function BookingConfirmationEmail({
  customerName,
  retreatTitle,
  retreatSlug,
  roomType,
  roomQuantity,
  extras,
  totalAmount,
  bookingDate,
}: BookingConfirmationEmailProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ✓ Reserva Confirmada
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                ¡Gracias por tu reserva!
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.6;">
                Hola <strong>${customerName || "Viajero"}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #333; line-height: 1.6;">
                Tu reserva para <strong>${retreatTitle}</strong> ha sido confirmada y procesada exitosamente.
              </p>

              <!-- Booking Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111; font-weight: 600;">
                      Detalles de tu Reserva
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Habitación:</td>
                        <td style="color: #111; font-size: 14px; font-weight: 500; text-align: right; padding: 8px 0;">
                          ${roomQuantity}x ${roomType}
                        </td>
                      </tr>
                      ${extras.length > 0 ? `
                        <tr>
                          <td colspan="2" style="padding-top: 12px; padding-bottom: 4px;">
                            <div style="border-top: 1px solid #e5e7eb;"></div>
                          </td>
                        </tr>
                        ${extras.map(extra => `
                          <tr>
                            <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">
                              ${extra.quantity}x ${extra.name}
                            </td>
                            <td style="color: #111; font-size: 14px; text-align: right; padding: 4px 0;">Extra</td>
                          </tr>
                        `).join('')}
                      ` : ''}
                      <tr>
                        <td colspan="2" style="padding-top: 12px; padding-bottom: 12px;">
                          <div style="border-top: 2px solid #e5e7eb;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #111; font-size: 16px; font-weight: 600; padding: 8px 0;">Total:</td>
                        <td style="color: #10b981; font-size: 20px; font-weight: 700; text-align: right; padding: 8px 0;">
                          ${formatPrice(totalAmount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
                      <strong>ℹ️ Próximos pasos:</strong><br>
                      Te contactaremos pronto con más información sobre el retiro y detalles logísticos.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Si tienes alguna pregunta, no dudes en responder a este email.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/retreats/${retreatSlug}" 
                       style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Ver Detalles del Retiro
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                ¡Nos vemos pronto! 🌟
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Fecha de reserva: ${new Date(bookingDate).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
