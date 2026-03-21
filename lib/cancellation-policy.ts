/**
 * Política de cancelación unificada (términos, formulario de reserva, emails).
 * Antelación: días naturales desde la comunicación escrita de cancelación hasta
 * el primer día del retiro (según fecha publicada en la ficha del retiro).
 */
export const CANCELLATION_POLICY = {
  intro:
    "Los plazos se calculan en días naturales desde la fecha en que el participante comunica por escrito la cancelación (email u otro canal indicado por YaY Experiences) hasta el día de inicio del retiro indicado en la ficha publicada del retiro.",

  /** Filas de la tabla (de mayor a menor antelación). */
  rows: [
    {
      antelacion: "90 días o más antes del inicio del retiro",
      devolucion: "70 % del importe abonado hasta la fecha de la cancelación",
      devolucionShort: "70 %",
      /** Columna derecha en tabla (email / UI compacta). */
      devolucionCelda: "70 %",
    },
    {
      antelacion: "Entre 30 y 89 días antes del inicio del retiro",
      devolucion: "40 % del importe abonado hasta la fecha de la cancelación",
      devolucionShort: "40 %",
      devolucionCelda: "40 %",
    },
    {
      antelacion: "Menos de 30 días antes del inicio del retiro",
      devolucion:
        "Sin devolución (0 %). El importe abonado no será reembolsable salvo obligación legal imperativa en contrario",
      devolucionShort: "0 %",
      devolucionCelda: "Sin devolución (0 %)",
    },
  ],

  baseAmountNote:
    "En todos los tramos, el porcentaje de devolución se aplica sobre el importe total abonado por el participante hasta la fecha de la solicitud de cancelación (depósito inicial, pagos parciales o importe íntegro, según corresponda en cada reserva). Las comisiones o gastos de pasarela de pago que no sean recuperables podrán descontarse del reembolso cuando proceda según las condiciones del proveedor de pagos.",

  processingNote:
    "Los reembolsos, cuando procedan, se tramitarán en un plazo razonable por el mismo medio o uno equivalente al utilizado para el pago, salvo acuerdo distinto.",
} as const;

/** Párrafos cortos para el formulario de reserva (misma política que términos). */
export function cancellationPolicyFormParagraphs(): string[] {
  const [r90, r30, r0] = CANCELLATION_POLICY.rows;
  return [
    `${r90.antelacion}: devolución del ${r90.devolucionShort} del importe abonado hasta la cancelación.`,
    `${r30.antelacion}: devolución del ${r30.devolucionShort} del importe abonado hasta la cancelación.`,
    `${r0.antelacion}: sin devolución (${r0.devolucionShort}).`,
  ];
}

/** Bloque HTML (solo texto fijo) para el email de confirmación de reserva. */
export function cancellationPolicyEmailInnerHtml(): string {
  const rowHtml = CANCELLATION_POLICY.rows
    .map(
      (r) => `
      <tr>
        <td style="padding: 10px 8px; font-size: 13px; color: #92400e; line-height: 1.45; border-bottom: 1px solid rgba(146, 64, 14, 0.12); vertical-align: top;">${r.antelacion}</td>
        <td style="padding: 10px 8px; font-size: 13px; color: #92400e; font-weight: 600; line-height: 1.45; border-bottom: 1px solid rgba(146, 64, 14, 0.12); text-align: right; vertical-align: top;">${r.devolucionCelda}</td>
      </tr>`,
    )
    .join("");

  return `
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; line-height: 1.5;">
      <strong>📌 Política de cancelación</strong>
    </p>
    <p style="margin: 0 0 10px 0; font-size: 12px; color: #92400e; line-height: 1.45;">
      Plazos en días naturales hasta el día de inicio del retiro (desde que nos comunicas la cancelación por escrito):
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
      ${rowHtml}
    </table>
    <p style="margin: 0 0 6px 0; font-size: 12px; color: #92400e; line-height: 1.45;">
      El porcentaje se aplica sobre el importe total abonado hasta la fecha de la cancelación (depósito, pagos parciales o importe completo).
    </p>
    <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.45;">
      Detalle y supuestos especiales en los términos y condiciones del sitio web.
    </p>
  `;
}
