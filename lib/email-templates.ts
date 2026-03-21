import { emailLayoutStyles as s } from "@/lib/email-layout-styles";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface BookingConfirmationEmailProps {
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
  baseUrl: string;
}

export function BookingConfirmationEmail({
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
  baseUrl,
}: BookingConfirmationEmailProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const safeName = escapeHtml(customerName || "Viajero");
  const safeTitle = escapeHtml(retreatTitle);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva</title>
</head>
<body style="${s.body}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${s.outerWrap}">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="${s.card}">
          
          <tr>
            <td style="${s.headerGreen}">
              <h1 style="${s.headerTitle}">
                ✓ Reserva Confirmada
              </h1>
              <p style="${s.headerSubtitle}">
                ¡Gracias por tu reserva!
              </p>
            </td>
          </tr>

          <tr>
            <td style="${s.contentCell}">
              <p style="${s.paragraph}">
                Hola <strong>${safeName}</strong>,
              </p>
              
              <p style="${s.paragraphLast}">
                Tu reserva para <strong>${safeTitle}</strong> ha sido confirmada y procesada exitosamente.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="${s.sectionBox}">
                <tr>
                  <td style="${s.sectionBoxInner}">
                    <h2 style="${s.sectionHeading}">
                      Detalles de tu Reserva
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Habitación:</td>
                        <td style="color: #111; font-size: 14px; font-weight: 500; text-align: right; padding: 8px 0;">
                          ${roomQuantity}x ${escapeHtml(roomType)}
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
                              ${extra.quantity}x ${escapeHtml(extra.name)}
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
                        <td style="color: #111; font-size: 15px; font-weight: 600; padding: 8px 0;">Total reserva:</td>
                        <td style="color: #111; font-size: 15px; font-weight: 600; text-align: right; padding: 8px 0;">
                          ${formatPrice(totalAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #111; font-size: 15px; font-weight: 600; padding: 8px 0;">Pagado ahora:</td>
                        <td style="color: #10b981; font-size: 18px; font-weight: 700; text-align: right; padding: 8px 0;">
                          ${formatPrice(chargedAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Pendiente:</td>
                        <td style="color: #6b7280; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">
                          ${formatPrice(pendingAmount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="${s.infoBoxBlue}">
                <tr>
                  <td style="${s.infoBoxBlueInner}">
                    <p style="${s.infoBoxBlueText}">
                      <strong>ℹ️ Próximos pasos:</strong><br>
                      Te contactaremos pronto con más información sobre el retiro y detalles logísticos.
                      ${pendingAmount > 0 ? " El saldo pendiente se gestionará por factura aproximadamente 1 mes antes del retiro." : ""}
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="${s.noticeBoxAmber}">
                <tr>
                  <td style="${s.noticeBoxAmberInner}">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; line-height: 1.5;">
                      <strong>📌 Política de cancelación</strong>
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                      Si cancelas con menos de 1 mes de antelación, el importe de la reserva no se devuelve.
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                      Si cancelas con 3 meses o más de antelación, devolvemos una parte del importe abonado en la reserva.
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                      Estas condiciones nos ayudan a organizar la logística con tiempo y cuidar la experiencia del grupo.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="${s.mutedParagraph}">
                Si tienes alguna pregunta, no dudes en responder a este email.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="${s.ctaWrap}">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(`${baseUrl}/retreats/${retreatSlug}`)}" 
                       style="${s.ctaButton}">
                      Ver Detalles del Retiro
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="${s.footer}">
              <p style="${s.footerLine}">
                ¡Nos vemos pronto! 🌟
              </p>
              <p style="${s.footerMeta}">
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

export type WaitlistAlternativeRetreat = {
  title: string;
  slug: string;
  imageUrl: string;
};

interface WaitlistJoinedEmailProps {
  retreatTitle: string;
  retreatSlug: string;
  baseUrl: string;
  alternativeRetreats: WaitlistAlternativeRetreat[];
}

export function WaitlistJoinedEmail({
  retreatTitle,
  retreatSlug,
  baseUrl,
  alternativeRetreats,
}: WaitlistJoinedEmailProps) {
  const safeTitle = escapeHtml(retreatTitle);
  const retreatUrl = `${baseUrl.replace(/\/$/, "")}/retreats/${retreatSlug}`;

  const alternativesSection =
    alternativeRetreats.length === 0
      ? ""
      : `
              <table width="100%" cellpadding="0" cellspacing="0" style="${s.sectionBox}">
                <tr>
                  <td style="${s.sectionBoxInner}">
                    <h2 style="${s.sectionHeading}">
                      Mira si estos otros retiros te gustan
                    </h2>
                    <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                      Tienen plazas disponibles ahora mismo.
                    </p>
                    ${alternativeRetreats
                      .map(
                        (r) => `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <a href="${escapeHtml(`${baseUrl.replace(/\/$/, "")}/retreats/${r.slug}`)}" style="${s.retreatCardLink}">
                            <img src="${escapeHtml(r.imageUrl)}" alt="${escapeHtml(r.title)}" width="520" style="${s.retreatCardImage}" />
                            <p style="${s.retreatCardTitle}">${escapeHtml(r.title)}</p>
                          </a>
                        </td>
                      </tr>
                    </table>`,
                      )
                      .join("")}
                  </td>
                </tr>
              </table>
`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de espera</title>
</head>
<body style="${s.body}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${s.outerWrap}">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="${s.card}">
          <tr>
            <td style="${s.headerGreen}">
              <h1 style="${s.headerTitle}">
                Lista de espera
              </h1>
              <p style="${s.headerSubtitle}">
                Hemos recibido tu petición
              </p>
            </td>
          </tr>

          <tr>
            <td style="${s.contentCell}">
              <p style="${s.paragraph}">
                Hola,
              </p>
              <p style="${s.paragraphLast}">
                Gracias por apuntarte a la lista de espera para <strong>${safeTitle}</strong>. Hemos guardado tu email correctamente.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="${s.infoBoxBlue}">
                <tr>
                  <td style="${s.infoBoxBlueInner}">
                    <p style="${s.infoBoxBlueText}">
                      <strong>¿Qué pasa ahora?</strong><br><br>
                      Si se libera una plaza, iremos avisando por orden de inscripción.<br><br>
                      Si se apunta suficiente gente a la lista, es posible que organicemos <strong>otro retiro en las mismas condiciones</strong>. En ese caso también te lo haremos saber por email.
                    </p>
                  </td>
                </tr>
              </table>

              ${alternativesSection}

              <p style="${s.mutedParagraph}">
                Si tienes cualquier duda, puedes responder a este mensaje.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="${s.ctaWrap}">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(retreatUrl)}" style="${s.ctaButton}">
                      Ver la página del retiro
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="${s.footer}">
              <p style="${s.footerLine}">
                Un abrazo,<br>el equipo
              </p>
              <p style="${s.footerMeta}">
                Lista de espera · ${safeTitle}
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
