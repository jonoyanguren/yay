"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import type { EventRow } from "@/lib/types";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        setEvents(await res.json());
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        setError("Error al cargar eventos");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const togglePublish = async (slug: string) => {
    const res = await fetch(`/api/admin/events/${slug}/publish`, {
      method: "POST",
    });
    if (res.ok) fetchEvents();
  };

  const handleDelete = async (slug: string, title: string) => {
    const result = await Swal.fire({
      title: "Eliminar evento",
      html: `¿Eliminar <strong>${title}</strong>?<br><br><span class="text-sm text-slate-600">Se borrarán también todas las inscripciones asociadas (pendientes, pagadas, etc.).</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    const deleteEvent = async (force = false) =>
      fetch(`/api/admin/events/${slug}${force ? "?force=1" : ""}`, {
        method: "DELETE",
      });

    let res = await deleteEvent();
    let data = await res.json().catch(() => ({}));

    if (res.status === 409 && data.requiresForce) {
      const forceResult = await Swal.fire({
        title: "Inscripciones pagadas",
        html: `Hay <strong>${data.paidCount ?? "algunas"}</strong> inscripción(es) pagada(s).<br><br>Solo confirma si es un evento de prueba o quieres eliminar el historial.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Eliminar igualmente",
        cancelButtonText: "Cancelar",
      });
      if (!forceResult.isConfirmed) return;
      res = await deleteEvent(true);
      data = await res.json().catch(() => ({}));
    }

    if (res.ok) {
      fetchEvents();
    } else {
      Swal.fire("Error", data.error || "No se pudo eliminar", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-slate-600 hover:text-slate-800 text-sm">
              &larr; Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 mt-2">Eventos</h1>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
          >
            Nuevo evento
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-600 mb-4">
          Solo aparecen en <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/events</code>{" "}
          los eventos publicados y no ocultos de la web.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Título</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-slate-600">{event.date || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePublish(event.slug)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          event.published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {event.published ? "Publicado" : "Borrador"}
                      </button>
                      {event.published && event.hideFromWeb && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          Oculto en web
                        </span>
                      )}
                      {event.published && !event.hideFromWeb && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                          Visible en /events
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/events/${event.slug}/preview`}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded"
                        title="Preview"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/admin/events/${event.slug}/edit`}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded"
                        title="Editar"
                      >
                        <FaPencilAlt />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.slug, event.title)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No hay eventos todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
