"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaPencilAlt, FaTrash, FaEllipsisV } from "react-icons/fa";
import Swal from "sweetalert2";

interface Retreat {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  published: boolean;
  forceSoldOut: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [openMenuSlug, setOpenMenuSlug] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRetreats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/retreats");

      if (res.ok) {
        const data = await res.json();
        setRetreats(data);
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        setError("Error fetching retreats");
      }
    } catch {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRetreats();
  }, [fetchRetreats]);

  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuSlug(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setOpenMenuSlug(null);
      setMenuPosition(null);
    };
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar retiro",
      text: `¿Seguro que quieres borrar "${title}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/retreats/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRetreats(retreats.filter((r) => r.slug !== slug));
        showToast("success", "Retiro eliminado correctamente.");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(
          "error",
          data.error || "No se ha podido borrar el retiro.",
        );
      }
    } catch {
      showToast("error", "No se ha podido borrar el retiro.");
    }
  };

  const handleTogglePublish = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/retreats/${slug}/publish`, {
        method: "POST",
      });

      if (res.ok) {
        const updatedRetreat = await res.json();
        setRetreats(
          retreats.map((r) =>
            r.slug === slug ? { ...r, published: updatedRetreat.published } : r
          )
        );
      } else {
        showToast("error", "No se pudo cambiar el estado de publicación.");
      }
    } catch {
      showToast("error", "No se pudo cambiar el estado de publicación.");
    }
  };

  const handleToggleForceSoldOut = async (slug: string, nextValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/retreats/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forceSoldOut: nextValue }),
      });

      if (res.ok) {
        setRetreats((prev) =>
          prev.map((r) =>
            r.slug === slug ? { ...r, forceSoldOut: nextValue } : r,
          ),
        );
      } else {
        showToast("error", "No se pudo cambiar el estado de completo.");
      }
    } catch {
      showToast("error", "No se pudo cambiar el estado de completo.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };
  const activeRetreat = retreats.find((retreat) => retreat.slug === openMenuSlug) ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-rose-600 text-white border-rose-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Retreat Dashboard
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/bookings"
              className="bg-violet-600 text-white px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors font-medium text-xs md:text-sm"
            >
              📋 Ver Reservas
            </Link>
            <Link
              href="/admin/waitlist"
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs md:text-sm"
            >
              📨 Waitlist
            </Link>
            <Link
              href="/admin/email-templates"
              className="bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium text-xs md:text-sm"
            >
              ✉️ Emails
            </Link>
            <Link
              href="/admin/retreats/new"
              className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-xs md:text-sm"
            >
              + New Retreat
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium text-xs md:text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg mb-3 font-medium text-sm">
            {error}
          </div>
        )}

        {/* Retreats Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {retreats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No retreats yet. Create your first one!
                  </td>
                </tr>
              ) : (
                retreats.map((retreat) => (
                  <tr key={retreat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{retreat.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{retreat.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {retreat.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {retreat.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            retreat.published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {retreat.published ? "Published" : "Draft"}
                        </span>
                        {retreat.forceSoldOut && (
                          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">
                            Completo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              const rect = (
                                event.currentTarget as HTMLButtonElement
                              ).getBoundingClientRect();
                              const nextIsOpen = openMenuSlug !== retreat.slug;
                              setOpenMenuSlug(nextIsOpen ? retreat.slug : null);
                              setMenuPosition(
                                nextIsOpen
                                  ? {
                                      top: rect.bottom + 8,
                                      left: rect.right - 288,
                                    }
                                  : null,
                              );
                            }}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Acciones"
                            aria-label="Abrir acciones del retiro"
                          >
                            <FaEllipsisV className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {activeRetreat && menuPosition && (
        <div
          className="fixed w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-40 p-2 space-y-1"
          style={{
            top: `${menuPosition.top}px`,
            left: `${Math.max(16, menuPosition.left)}px`,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Link
            href={
              activeRetreat.published
                ? `/retreats/${activeRetreat.slug}`
                : `/admin/retreats/${activeRetreat.slug}/preview`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
          >
            <FaEye className="w-4 h-4 text-slate-500" />
            <span>{activeRetreat.published ? "Ver publicado" : "Ver preview"}</span>
          </Link>

          <Link
            href={`/admin/retreats/${activeRetreat.slug}/edit`}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
          >
            <FaPencilAlt className="w-4 h-4 text-slate-500" />
            <span>Editar retiro</span>
          </Link>

          <div className="border-t border-slate-100 my-1" />

          <button
            type="button"
            onClick={() => handleTogglePublish(activeRetreat.slug)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
          >
            <span className="font-medium">Publicado</span>
            <span
              role="switch"
              aria-checked={activeRetreat.published}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                activeRetreat.published ? "bg-emerald-400" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  activeRetreat.published ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleToggleForceSoldOut(activeRetreat.slug, !activeRetreat.forceSoldOut)
            }
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
          >
            <span className="font-medium">Marcar completo</span>
            <span
              role="switch"
              aria-checked={activeRetreat.forceSoldOut}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                activeRetreat.forceSoldOut ? "bg-rose-400" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  activeRetreat.forceSoldOut ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
          </button>

          <div className="border-t border-slate-100 my-1" />

          <button
            type="button"
            onClick={() => handleDelete(activeRetreat.slug, activeRetreat.title)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 text-sm text-rose-600"
          >
            <FaTrash className="w-4 h-4" />
            <span>Eliminar retiro</span>
          </button>
        </div>
      )}
    </div>
  );
}
