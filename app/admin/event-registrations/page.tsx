"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import type { EventRegistrationRow, EventRow } from "@/lib/types";

function formatPrice(cents: number | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function AdminEventRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<EventRegistrationRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (eventFilter !== "all") params.set("eventId", eventFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const [regsRes, eventsRes] = await Promise.all([
        fetch(`/api/admin/event-registrations?${params.toString()}`),
        fetch("/api/admin/events"),
      ]);

      if (regsRes.status === 401 || eventsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (regsRes.ok) setRegistrations(await regsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (!regsRes.ok) setError("Error al cargar inscripciones");
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }, [router, eventFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (reg: EventRegistrationRow) => {
    const result = await Swal.fire({
      title: "Eliminar inscripción",
      html: `¿Eliminar la inscripción de <strong>${reg.customerEmail}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    const deleteRegistration = async (force = false) =>
      fetch(`/api/admin/event-registrations/${reg.id}${force ? "?force=1" : ""}`, {
        method: "DELETE",
      });

    let res = await deleteRegistration();
    let data = await res.json().catch(() => ({}));

    if (res.status === 409 && data.requiresForce) {
      const forceResult = await Swal.fire({
        title: "Inscripción pagada",
        text: "Esta inscripción tiene pago registrado. ¿Eliminarla igualmente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Eliminar igualmente",
        cancelButtonText: "Cancelar",
      });
      if (!forceResult.isConfirmed) return;
      res = await deleteRegistration(true);
      data = await res.json().catch(() => ({}));
    }

    if (res.ok) {
      fetchData();
    } else {
      Swal.fire("Error", data.error || "No se pudo eliminar", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando inscripciones...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-slate-600 hover:text-slate-800 text-sm">
            &larr; Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">
            Inscripciones a eventos
          </h1>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos los eventos</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="paid">Pagado</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Evento</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-left px-4 py-3 font-semibold">Importe</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">
                    {reg.event?.title || "—"}
                  </td>
                  <td className="px-4 py-3">{reg.customerEmail}</td>
                  <td className="px-4 py-3">{reg.customerName || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        reg.status === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : reg.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(reg.stripeAmountTotalCents)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(reg.createdAt).toLocaleString("es-ES")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(reg)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded"
                      title="Eliminar inscripción"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No hay inscripciones.
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
