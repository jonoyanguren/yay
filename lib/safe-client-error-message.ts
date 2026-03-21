/**
 * Mensaje seguro para JSON de error hacia el cliente (evita filtrar trazas Prisma/Turbopack).
 * Errores Stripe suelen ser una línea y sí pueden mostrarse.
 */
export function clientFacingErrorMessage(
  error: unknown,
  genericMessage = "No se pudo completar la operación. Inténtalo de nuevo.",
): string {
  if (!(error instanceof Error)) return genericMessage;

  const ctor = error.constructor?.name ?? "";
  if (ctor.includes("Stripe")) {
    const m = error.message;
    if (m.length <= 500 && !m.includes("\n") && !m.includes("__TURBOPACK__")) {
      return m;
    }
  }

  const m = error.message;
  if (
    m.includes("\n") ||
    m.includes("__TURBOPACK__") ||
    m.includes("Unknown argument") ||
    m.includes("Invalid `") ||
    m.length > 300
  ) {
    return genericMessage;
  }

  return m;
}
