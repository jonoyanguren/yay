"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Booking {
  id: string;
  customerEmail: string;
  customerName: string | null;
  status: string;
  createdAt: string;
  stripeSessionId: string | null;
  retreat: {
    id: string;
    title: string;
    slug: string;
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
  booking.roomSlots.forEach(slot => {
    total += slot.retreatRoomType.priceCents * slot.quantity;
  });
  
  // Extras
  booking.extras.forEach(extra => {
    total += extra.retreatExtraActivity.priceCents * extra.quantity;
  });
  
  return total;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [newBooking, setNewBooking] = useState({
    retreatId: "",
    customerEmail: "",
    customerName: "",
    roomTypeId: "",
    roomQuantity: 1,
    extras: [] as { id: string; quantity: number }[],
    status: "paid" as "paid" | "pending",
  });

  const fetchBookings = async () => {
    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch("/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setError("Error fetching bookings");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRetreats = async () => {
    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch("/api/admin/retreats", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Retreats fetched:", data);
        setRetreats(data);
      } else {
        console.error("Error fetching retreats, status:", res.status);
      }
    } catch (err) {
      console.error("Error fetching retreats:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRetreats();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings(
          bookings.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
      } else {
        alert("Error actualizando el estado");
      }
    } catch (err) {
      alert("Error actualizando el estado");
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
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
      } else {
        const data = await res.json();
        alert(data.error || "Error creando la reserva");
      }
    } catch (err) {
      alert("Error creando la reserva");
    }
  };

  const handleSendEmail = async (bookingId: string, customerEmail: string) => {
    if (!confirm(`¿Enviar email de confirmación a ${customerEmail}?`)) return;

    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/send-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        alert("Email enviado correctamente ✓");
      } else {
        const data = await res.json();
        alert(data.error || "Error enviando el email");
      }
    } catch (err) {
      alert("Error enviando el email");
    }
  };

  const selectedRetreat = retreats.find((r) => r.id === newBooking.retreatId);

  const handleLogout = () => {
    localStorage.removeItem("adminPassword");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const filteredBookings = filterStatus === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.status === "paid").length,
    pending: bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue: bookings
      .filter(b => b.status === "paid")
      .reduce((sum, b) => sum + calculateTotal(b), 0),
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Reservas</h1>
            <p className="text-slate-600 mt-2">Gestiona todas las reservas del sistema</p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600 mb-1">Total Reservas</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
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
            <p className="text-3xl font-bold text-slate-600">{stats.cancelled}</p>
          </div>
          <div className="bg-violet-50 p-6 rounded-xl shadow-sm border border-violet-100">
            <p className="text-sm text-violet-700 mb-1">Ingresos</p>
            <p className="text-2xl font-bold text-violet-700">{formatPrice(stats.revenue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
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
                    Total
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
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No hay reservas{filterStatus !== "all" && ` con estado "${filterStatus}"`}.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {booking.customerName || "Sin nombre"}
                        </div>
                        <div className="text-sm text-slate-500">{booking.customerEmail}</div>
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
                            <div className="text-xs text-slate-500 mt-1">
                              + {booking.extras.length} extra{booking.extras.length > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {formatPrice(calculateTotal(booking))}
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
                              : booking.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
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
                            onClick={() => handleSendEmail(booking.id, booking.customerEmail)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            title="Enviar email de confirmación"
                          >
                            📧 Enviar Email
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
                ) : retreats.filter(r => r.published).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-rose-600">
                      No hay retiros publicados. Publica un retiro primero para crear reservas.
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
                      console.log("Selected retreat ID:", e.target.value);
                      setNewBooking({
                        ...newBooking,
                        retreatId: e.target.value,
                        roomTypeId: "",
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar retiro...</option>
                    {retreats.filter(r => r.published).length === 0 && (
                      <option disabled>No hay retiros publicados disponibles</option>
                    )}
                    {retreats
                      .filter(retreat => retreat.published)
                      .map((retreat) => (
                        <option key={retreat.id} value={retreat.id}>
                          {retreat.title}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {retreats.filter(r => r.published).length} retiro(s) publicado(s)
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
                        status: e.target.value as "paid" | "pending",
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="paid">Pagada</option>
                    <option value="pending">Pendiente</option>
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
