"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  EMAIL_TEMPLATE_IDS,
  EMAIL_TEMPLATE_LABELS,
  type EmailTemplateId,
} from "@/lib/email-templates-meta";

export default function AdminEmailTemplatesPage() {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<EmailTemplateId>(
    EMAIL_TEMPLATE_IDS[0],
  );
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewFrameHeight, setPreviewFrameHeight] = useState(320);

  const fitPreviewIframeHeight = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.documentElement) return;
    const h = doc.documentElement.scrollHeight;
    if (h > 0) setPreviewFrameHeight(h);
  }, []);

  const loadPreview = useCallback(async (id: EmailTemplateId) => {
    setPreviewLoading(true);
    setPreviewError("");
    try {
      const res = await fetch(
        `/api/admin/email-templates/preview?id=${encodeURIComponent(id)}`,
      );
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPreviewError(data.error || "Error cargando la vista previa");
        setPreviewHtml("");
        return;
      }
      setPreviewHtml(typeof data.html === "string" ? data.html : "");
    } catch {
      setPreviewError("Error de red");
      setPreviewHtml("");
    } finally {
      setPreviewLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadPreview(templateId);
  }, [templateId, loadPreview]);

  useEffect(() => {
    if (!previewHtml) return;
    setPreviewFrameHeight(320);
  }, [previewHtml]);

  const handleSendTest = async () => {
    const to = testEmail.trim();
    if (!to) {
      await Swal.fire({
        icon: "warning",
        title: "Email vacío",
        text: "Escribe un email para recibir la prueba.",
      });
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/email-templates/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, to }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Enviado",
          text: `Revisa la bandeja de ${to} (y spam). Asunto empieza por [PRUEBA].`,
          timer: 4000,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "No se envió",
          text: data.error || "Error desconocido",
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error de red",
      });
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Plantillas de email
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Vista previa con datos de ejemplo. El envío de prueba usa el mismo
              HTML con asunto{" "}
              <span className="font-mono text-xs bg-slate-200/80 px-1 rounded">
                [PRUEBA]
              </span>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
            <Link
              href="/admin/bookings"
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
            >
              Reservas
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-sm font-medium hover:bg-slate-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="template-select"
                className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5"
              >
                Plantilla
              </label>
              <select
                id="template-select"
                value={templateId}
                onChange={(e) =>
                  setTemplateId(e.target.value as EmailTemplateId)
                }
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white"
              >
                {EMAIL_TEMPLATE_IDS.map((id) => (
                  <option key={id} value={id}>
                    {EMAIL_TEMPLATE_LABELS[id]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[220px]">
              <label
                htmlFor="test-email"
                className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5"
              >
                Enviar prueba a
              </label>
              <input
                id="test-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
            <button
              type="button"
              onClick={handleSendTest}
              disabled={sending}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {sending ? "Enviando…" : "Enviar prueba"}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Los datos mostrados son ficticios (nombre, importes, enlaces de
            ejemplo). Solo usuarios con permiso de escritura en reservas pueden
            enviar pruebas.
          </p>
        </div>

        <div className="bg-slate-200/60 rounded-xl border border-slate-200">
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-medium text-slate-600 rounded-t-xl">
            Vista previa
          </div>
          {previewLoading ? (
            <div className="p-16 text-center text-slate-500 text-sm bg-white rounded-b-xl">
              Cargando…
            </div>
          ) : previewError ? (
            <div className="p-8 text-center text-rose-600 text-sm bg-white rounded-b-xl">
              {previewError}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="Vista previa del email"
              className="w-full bg-white border-0 block rounded-b-xl"
              style={{
                height: previewFrameHeight,
                overflow: "hidden",
              }}
              sandbox="allow-same-origin"
              srcDoc={previewHtml}
              onLoad={() => {
                fitPreviewIframeHeight();
                requestAnimationFrame(fitPreviewIframeHeight);
                window.setTimeout(fitPreviewIframeHeight, 200);
                window.setTimeout(fitPreviewIframeHeight, 600);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
