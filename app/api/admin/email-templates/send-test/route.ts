import { requireAdminAuth } from "@/lib/auth";
import { isEmailTemplateId } from "@/lib/email-templates-meta";
import { getResendFrom } from "@/lib/resend-from";
import {
  emailTemplateTestSubject,
  renderEmailTemplateHtml,
} from "@/lib/email-template-preview";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

/**
 * POST /api/admin/email-templates/send-test
 * Body: { templateId: string, to: string }
 */
export async function POST(request: Request) {
  const auth = await requireAdminAuth(request, "bookings:write");
  if (auth instanceof Response) return auth;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY no configurada" },
      { status: 500 },
    );
  }

  let body: { templateId?: string; to?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const templateId = body.templateId?.trim() ?? "";
  const to = body.to?.trim() ?? "";

  if (!isEmailTemplateId(templateId)) {
    return NextResponse.json(
      { error: "Plantilla no válida" },
      { status: 400 },
    );
  }
  if (!isValidEmail(to)) {
    return NextResponse.json({ error: "Email no válido" }, { status: 400 });
  }

  try {
    const html = renderEmailTemplateHtml(templateId);
    const subject = emailTemplateTestSubject(templateId);

    const { data, error } = await resend.emails.send({
      from: getResendFrom(),
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("[email-templates/send-test]", error);
      return NextResponse.json(
        { error: typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "Error de Resend" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error("[email-templates/send-test]", e);
    return NextResponse.json(
      { error: "No se pudo enviar el email de prueba" },
      { status: 500 },
    );
  }
}
