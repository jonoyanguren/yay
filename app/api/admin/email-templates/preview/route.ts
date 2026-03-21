import { requireAdminAuth } from "@/lib/auth";
import { isEmailTemplateId } from "@/lib/email-templates-meta";
import { renderEmailTemplateHtml } from "@/lib/email-template-preview";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/email-templates/preview?id=booking_confirmation
 */
export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "bookings:read");
  if (auth instanceof Response) return auth;

  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!isEmailTemplateId(id)) {
    return NextResponse.json(
      { error: "Plantilla no válida" },
      { status: 400 },
    );
  }

  const html = renderEmailTemplateHtml(id);
  return NextResponse.json({ html });
}
