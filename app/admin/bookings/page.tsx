"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

interface Booking {
  id: string;
  customerEmail: string;
  customerName: string | null;
  status: string;
  createdAt: string;
  stripeSessionId: string | null;
  stripeCustomerId: string | null;
  stripeAmountTotalCents: number | null;
  stripePaymentType: string | null;
  retreat: {
    id: string;
    title: string;
    slug: string;
    reservationDepositCents: number;
    chargeFullAmount?: boolean;
  };
  roomSlots: Array<{
    quantity: number;
    retreatRoomType: {
      name: string;
      priceCents: number;
    };
  }>;
  extras: Array<{
    quantity: number;
    retreatExtraActivity: {
      name: string;
      priceCents: number;
    };
  }>;
}

interface Retreat {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  roomTypes: Array<{
    id: string;
    name: string;
    priceCents: number;
  }>;
  extraActivities: Array<{
    id: string;
    name: string;
    priceCents: number;
  }>;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateTotal(booking: Booking): number {
  let total = 0;

  // Room slots
  booking.roomSlots.forEach((slot) => {
    total += slot.retreatRoomType.priceCents * slot.quantity;
  });

  // Extras
  booking.extras.forEach((extra) => {
    total += extra.retreatExtraActivity.priceCents * extra.quantity;
  });

  return total;
}

function getChargedCents(booking: Booking): number {
  if (booking.stripeAmountTotalCents != null)
    return booking.stripeAmountTotalCents;
  if (booking.status === "pending" || booking.status === "cancelled") return 0;
  if (!booking.stripeSessionId) return calculateTotal(booking);
  if (booking.retreat.chargeFullAmount ?? false) return calculateTotal(booking);
  return Math.min(
    booking.retreat.reservationDepositCents,
    calculateTotal(booking),
  );
}

function getPendingCents(booking: Booking): number {
  return Math.max(0, calculateTotal(booking) - getChargedCents(booking));
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRetreatId, setFilterRetreatId] = useState<string>("all");
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [newBooking, setNewBooking] = useState({
    retreatId: "",
    customerEmail: "",
    customerName: "",
    roomTypeId: "",
    roomQuantity: 1,
    extras: [] as { id: string; quantity: number }[],
    status: "paid" as "paid" | "deposit" | "pending" | "cancelled",
  });

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
      timer: 2600,
      timerProgressBar: true,
    });

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        setError("Error fetching bookings");
      }
    } catch {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRetreats = async () => {
    try {
      const res = await fetch("/api/admin/retreats");

      if (res.ok) {
        const data = await res.json();
        setRetreats(data);
      } else {
        console.error("Error fetching retreats, status:", res.status);
      }
    } catch {
      console.error("Error fetching retreats");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRetreats();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings(
          bookings.map((b) => (b.id === bookingId ? updatedBooking : b)),
        );
      } else {
        await showToast("error", "Error actualizando el estado");
      }
    } catch {
      await showToast("error", "Error actualizando el estado");
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      if (res.ok) {
        const createdBooking = await res.json();
        setBookings([createdBooking, ...bookings]);
        setShowNewBookingModal(false);
        setNewBooking({
          retreatId: "",
          customerEmail: "",
          customerName: "",
          roomTypeId: "",
          roomQuantity: 1,
          extras: [],
          status: "paid",
        });
        await showToast("success", "Reserva creada correctamente");
      } else {
        const data = await res.json();
        await showToast("error", data.error || "Error creando la reserva");
      }
    } catch {
      await showToast("error", "Error creando la reserva");
    }
  };

  const handleSendEmail = async (bookingId: string, customerEmail: string) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Enviar email",
      text: `¿Enviar email de confirmación a ${customerEmail}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/send-email`, {
        method: "POST",
      });

      if (res.ok) {
        await showToast("success", "Email enviado correctamente");
      } else {
        const data = await res.json();
        await showToast("error", data.error || "Error enviando el email");
      }
    } catch {
      await showToast("error", "Error enviando el email");
    }
  };

  const handleDeleteBooking = async (
    bookingId: string,
    customerEmail: string,
  ) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Borrar reserva",
      text: `¿Borrar la reserva de ${customerEmail}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });
    if (!result.isConfirmed) {
      return;
    }

    setDeletingBookingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        await showToast("success", "Reserva borrada");
      } else {
        const data = await res.json();
        await showToast("error", data.error || "Error borrando la reserva");
      }
    } catch {
      await showToast("error", "Error borrando la reserva");
    } finally {
      setDeletingBookingId(null);
    }
  };

  const selectedRetreat = retreats.find((r) => r.id === newBooking.retreatId);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking) => {
    const statusMatches =
      filterStatus === "all" || booking.status === filterStatus;
    const retreatMatches =
      filterRetreatId === "all" || booking.retreat.id === filterRetreatId;
    return statusMatches && retreatMatches;
  });

  const stats = {
    total: bookings.length,
    deposit: bookings.filter((b) => b.status === "deposit").length,
    paid: bookings.filter((b) => b.status === "paid").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    estimatedRevenue: bookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + calculateTotal(b), 0),
    realRevenue: bookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + getChargedCents(b), 0),
    reservationOnlyRevenue: bookings
      .filter(
        (b) =>
          b.status === "paid" &&
          getChargedCents(b) > 0 &&
          getChargedCents(b) < calculateTotal(b),
      )
      .reduce((sum, b) => sum + getChargedCents(b), 0),
    pendingInvoiceAmount: bookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + getPendingCents(b), 0),
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Reservas</h1>
            <p className="text-slate-600 mt-2">
              Gestiona todas las reservas del sistema
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewBookingModal(true)}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
            >
              + Nueva Reserva Manual
            </button>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600 mb-1">Total Reservas</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-cyan-50 p-6 rounded-xl shadow-sm border border-cyan-100">
            <p className="text-sm text-cyan-700 mb-1">Señal</p>
            <p className="text-3xl font-bold text-cyan-700">{stats.deposit}</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100">
            <p className="text-sm text-emerald-700 mb-1">Pagadas</p>
            <p className="text-3xl font-bold text-emerald-700">{stats.paid}</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-100">
            <p className="text-sm text-amber-700 mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Canceladas</p>
            <p className="text-3xl font-bold text-slate-600">
              {stats.cancelled}
            </p>
          </div>
          <div className="bg-violet-50 p-6 rounded-xl shadow-sm border border-violet-100">
            <p className="text-sm text-violet-700 mb-1">Ingresos estimados</p>
            <p className="text-2xl font-bold text-violet-700">
              {formatPrice(stats.estimatedRevenue)}
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
            <p className="text-sm text-blue-700 mb-1">Cobrado real (Stripe)</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatPrice(stats.realRevenue)}
            </p>
          </div>
          <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-100">
            <p className="text-sm text-orange-700 mb-1">Solo señal cobrada</p>
            <p className="text-2xl font-bold text-orange-700">
              {formatPrice(stats.reservationOnlyRevenue)}
            </p>
            <p className="text-xs text-orange-700/80 mt-1">
              Pendiente de facturar: {formatPrice(stats.pendingInvoiceAmount)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Todas ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus("deposit")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "deposit"
                ? "bg-cyan-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Señal ({stats.deposit})
          </button>
          <button
            onClick={() => setFilterStatus("paid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "paid"
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Pagadas ({stats.paid})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-amber-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Pendientes ({stats.pending})
          </button>
          {stats.cancelled > 0 && (
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "cancelled"
                  ? "bg-slate-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Canceladas ({stats.cancelled})
            </button>
          )}
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

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Retiro
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Habitación
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Importe
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Pendiente
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No hay reservas
                      {filterStatus !== "all" &&
                        ` con estado "${filterStatus}"`}
                      .
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {booking.customerName || "Sin nombre"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {booking.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/retreats/${booking.retreat.slug}`}
                          target="_blank"
                          className="font-medium text-slate-900 hover:text-emerald-600 transition-colors"
                        >
                          {booking.retreat.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700">
                          {booking.roomSlots.map((slot, idx) => (
                            <div key={idx}>
                              {slot.quantity}x {slot.retreatRoomType.name}
                            </div>
                          ))}
                          {booking.extras.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1 space-y-1">
                              {booking.extras.map((extra, idx) => (
                                <div key={idx}>
                                  + {extra.quantity}x{" "}
                                  {extra.retreatExtraActivity.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          Estimado: {formatPrice(calculateTotal(booking))}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Cobrado: {formatPrice(getChargedCents(booking))}
                        </div>
                        {booking.stripePaymentType === "reservation_fee" && (
                          <div className="text-xs text-orange-700 mt-1">
                            Solo señal
                          </div>
                        )}
                        {booking.stripeCustomerId && (
                          <div className="text-xs text-slate-400 mt-1">
                            Cliente Stripe: {booking.stripeCustomerId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {formatPrice(getPendingCents(booking))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(booking.id, e.target.value)
                          }
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-colors cursor-pointer ${
                            booking.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : booking.status === "deposit"
                                ? "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100"
                                : booking.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <option value="deposit">Señal</option>
                          <option value="paid">Pagada</option>
                          <option value="pending">Pendiente</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleSendEmail(booking.id, booking.customerEmail)
                            }
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            title="Enviar email de confirmación"
                          >
                            📧 Enviar Email
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteBooking(
                                booking.id,
                                booking.customerEmail,
                              )
                            }
                            disabled={deletingBookingId === booking.id}
                            className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                            title="Borrar reserva"
                          >
                            {deletingBookingId === booking.id
                              ? "Borrando..."
                              : "🗑️ Borrar"}
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

        {/* Modal para crear nueva reserva */}
        {showNewBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">
                  Nueva Reserva Manual
                </h2>
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="p-6 space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600">Cargando retiros...</p>
                  </div>
                ) : retreats.filter((r) => r.published).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-rose-600">
                      No hay retiros publicados. Publica un retiro primero para
                      crear reservas.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Retiro */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Retiro *
                      </label>
                      <select
                        required
                        value={newBooking.retreatId}
                        onChange={(e) => {
                          setNewBooking({
                            ...newBooking,
                            retreatId: e.target.value,
                            roomTypeId: "",
                          });
                        }}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar retiro...</option>
                        {retreats.filter((r) => r.published).length === 0 && (
                          <option disabled>
                            No hay retiros publicados disponibles
                          </option>
                        )}
                        {retreats
                          .filter((retreat) => retreat.published)
                          .map((retreat) => (
                            <option key={retreat.id} value={retreat.id}>
                              {retreat.title}
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-1">
                        {retreats.filter((r) => r.published).length} retiro(s)
                        publicado(s)
                      </p>
                    </div>

                    {/* Cliente */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={newBooking.customerEmail}
                          onChange={(e) =>
                            setNewBooking({
                              ...newBooking,
                              customerEmail: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="cliente@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={newBooking.customerName}
                          onChange={(e) =>
                            setNewBooking({
                              ...newBooking,
                              customerName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Nombre del cliente"
                        />
                      </div>
                    </div>

                    {/* Habitación */}
                    {selectedRetreat && (
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">
                          Habitación *
                        </label>
                        <select
                          required
                          value={newBooking.roomTypeId}
                          onChange={(e) =>
                            setNewBooking({
                              ...newBooking,
                              roomTypeId: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar habitación...</option>
                          {selectedRetreat.roomTypes?.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.name} - {formatPrice(room.priceCents)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Estado *
                      </label>
                      <select
                        required
                        value={newBooking.status}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            status: e.target.value as
                              | "paid"
                              | "deposit"
                              | "pending"
                              | "cancelled",
                          })
                        }
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="deposit">Señal</option>
                        <option value="paid">Pagada</option>
                        <option value="pending">Pendiente</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowNewBookingModal(false)}
                        className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                      >
                        Crear Reserva
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
