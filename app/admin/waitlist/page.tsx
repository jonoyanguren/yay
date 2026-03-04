"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type WaitlistEntry = {
  id: string;
  email: string;
  status: "pending" | "contacted" | "closed";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  retreat: {
    id: string;
    slug: string;
    title: string;
  };
};

type RetreatOption = {
  id: string;
  title: string;
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WaitlistPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | WaitlistEntry["status"]>("all");
  const [filterRetreatId, setFilterRetreatId] = useState<string>("all");
  const [retreats, setRetreats] = useState<RetreatOption[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const showToast = (
    icon: "success" | "error" | "warning" | "info",
    title: string,
  ) =>
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true,
    });

  const fetchWaitlist = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterRetreatId !== "all") params.set("retreatId", filterRetreatId);
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/admin/waitlist${query}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        setError("Error cargando waitlist");
        return;
      }
      const data = await res.json();
      setEntries(data);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [filterRetreatId, filterStatus]);

  const fetchRetreats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/retreats");
      if (!res.ok) return;
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : [])
        .map((retreat: { id: string; title: string }) => ({
          id: retreat.id,
          title: retreat.title,
        }))
        .sort((a: RetreatOption, b: RetreatOption) =>
          a.title.localeCompare(b.title, "es"),
        );
      setRetreats(mapped);
    } catch {
      // Silent fail: waitlist page still works without this filter
    }
  }, []);

  useEffect(() => {
    fetchWaitlist();
  }, [fetchWaitlist]);

  useEffect(() => {
    fetchRetreats();
  }, [fetchRetreats]);

  const stats = useMemo(
    () => ({
      total: entries.length,
      pending: entries.filter((e) => e.status === "pending").length,
      contacted: entries.filter((e) => e.status === "contacted").length,
      closed: entries.filter((e) => e.status === "closed").length,
    }),
    [entries],
  );

  const handleStatusChange = async (
    id: string,
    status: WaitlistEntry["status"],
  ) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        await showToast("error", "No se pudo actualizar");
        return;
      }
      const updated = await res.json();
      setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
      await showToast("success", "Estado actualizado");
    } catch {
      await showToast("error", "No se pudo actualizar");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (entry: WaitlistEntry) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar contacto",
      text: `¿Borrar ${entry.email} de ${entry.retreat.title}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });
    if (!result.isConfirmed) return;

    setSavingId(entry.id);
    try {
      const res = await fetch(`/api/admin/waitlist/${entry.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await showToast("error", "No se pudo borrar");
        return;
      }
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      await showToast("success", "Contacto eliminado");
    } catch {
      await showToast("error", "No se pudo borrar");
    } finally {
      setSavingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Waitlist</h1>
            <p className="text-slate-600 mt-2">Gestiona la lista de espera de retiros completos</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              ← Volver al Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-lg mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-100">
            <p className="text-sm text-amber-700 mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100">
            <p className="text-sm text-blue-700 mb-1">Contactados</p>
            <p className="text-3xl font-bold text-blue-700">{stats.contacted}</p>
          </div>
          <div className="bg-emerald-50 p-5 rounded-xl shadow-sm border border-emerald-100">
            <p className="text-sm text-emerald-700 mb-1">Cerrados</p>
            <p className="text-3xl font-bold text-emerald-700">{stats.closed}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 items-center">
          {(["all", "pending", "contacted", "closed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status === "all"
                ? "Todos"
                : status === "pending"
                  ? "Pendientes"
                  : status === "contacted"
                    ? "Contactados"
                    : "Cerrados"}
            </button>
          ))}
          <select
            value={filterRetreatId}
            onChange={(event) => setFilterRetreatId(event.target.value)}
            className="ml-auto px-3 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700"
          >
            <option value="all">Todos los retiros</option>
            {retreats.map((retreat) => (
              <option key={retreat.id} value={retreat.id}>
                {retreat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Retiro
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Alta
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No hay entradas de waitlist.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-800">{entry.email}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/retreats/${entry.retreat.slug}`}
                          target="_blank"
                          className="font-medium text-slate-900 hover:text-emerald-600 transition-colors"
                        >
                          {entry.retreat.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={entry.status}
                          disabled={savingId === entry.id}
                          onChange={(event) =>
                            handleStatusChange(
                              entry.id,
                              event.target.value as WaitlistEntry["status"],
                            )
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 bg-white border-slate-200"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="contacted">Contactado</option>
                          <option value="closed">Cerrado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDelete(entry)}
                            disabled={savingId === entry.id}
                            className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
