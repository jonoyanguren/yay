"use client";

import { useState } from "react";
import type { RetreatRoomTypeWithAvailability } from "@/lib/types";
import type { RetreatExtraActivityRow } from "@/lib/types";
import Button from "@/components/ui/Button";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

type Props = {
  retreatId: string;
  retreatSlug: string;
  retreatTitle: string;
  roomTypes: RetreatRoomTypeWithAvailability[];
  extras: RetreatExtraActivityRow[];
};

export default function BookingForm({
  retreatId,
  retreatSlug,
  retreatTitle,
  roomTypes,
  extras,
}: Props) {
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>(
    roomTypes[0]?.id ?? ""
  );
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [extraQuantities, setExtraQuantities] = useState<
    Record<string, number>
  >(() => Object.fromEntries(extras.map((e) => [e.id, 0])));
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = roomTypes.find((r) => r.id === selectedRoomTypeId);
  const roomTotal = selectedRoom ? selectedRoom.price_cents * roomQuantity : 0;
  const extrasTotal = extras.reduce(
    (sum, e) => sum + e.price_cents * (extraQuantities[e.id] ?? 0),
    0
  );
  const totalCents = roomTotal + extrasTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedRoomTypeId || !email.trim()) {
      setError("Elige una habitación e indica tu email.");
      return;
    }
    if (selectedRoom && roomQuantity > selectedRoom.available) {
      setError("No hay tantas plazas disponibles para esa opción.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retreatId,
          slug: retreatSlug,
          roomTypeId: selectedRoomTypeId,
          roomQuantity,
          extras: extras
            .filter((e) => (extraQuantities[e.id] ?? 0) > 0)
            .map((e) => ({ id: e.id, quantity: extraQuantities[e.id] })),
          customerEmail: email.trim(),
          customerName: name.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la reserva");
        return;
      }
      if (data.url) window.location.href = data.url;
      else setError("No se recibió URL de pago");
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <h2 className="text-xl font-bold mb-6">Habitación</h2>
        <div className="flex flex-col gap-4">
          {roomTypes.map((room) => (
            <label
              key={room.id}
              className={`relative flex items-center gap-5 p-6 rounded-xl border-2 cursor-pointer transition-colors ${
                selectedRoomTypeId === room.id
                  ? "border-black bg-sand-light"
                  : "border-gray/15 bg-white hover:border-gray/30"
              }`}
            >
              <input
                type="radio"
                name="room"
                value={room.id}
                checked={selectedRoomTypeId === room.id}
                onChange={() => setSelectedRoomTypeId(room.id)}
                className="h-5 w-5 flex-shrink-0 accent-black cursor-pointer"
              />
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-lg">{room.name}</span>
                <span className="text-xl mt-1 font-semibold text-green">
                  {formatPrice(room.price_cents)}
                </span>
                <span className="text-sm text-black/60 mt-1">
                  {room.available} plazas disponibles
                </span>
              </div>
            </label>
          ))}
        </div>
        {selectedRoom && selectedRoom.available > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <label className="text-sm font-medium">Cantidad</label>
            <select
              value={roomQuantity}
              onChange={(e) => setRoomQuantity(Number(e.target.value))}
              className="rounded-lg border border-gray/20 px-4 py-2.5 text-sm"
            >
              {Array.from(
                { length: selectedRoom.available },
                (_, i) => i + 1
              ).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {extras.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">Extras opcionales</h2>
          <div className="flex flex-col gap-4">
            {extras.map((extra) => {
              const qty = extraQuantities[extra.id] ?? 0;
              const isSingle = !extra.allow_multiple;
              return (
                <div
                  key={extra.id}
                  className={`flex items-center gap-5 p-6 rounded-xl border-2 transition-colors ${
                    isSingle && qty > 0
                      ? "border-black bg-sand-light"
                      : "border-gray/15 bg-white hover:border-gray/30"
                  }`}
                >
                  {isSingle ? (
                    <label className="flex items-center gap-5 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={qty > 0}
                        onChange={(e) =>
                          setExtraQuantities((prev) => ({
                            ...prev,
                            [extra.id]: e.target.checked ? 1 : 0,
                          }))
                        }
                        className="h-5 w-5 flex-shrink-0 rounded border-2 border-gray/30 accent-black cursor-pointer"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-lg">{extra.name}</span>
                        <span className="text-green font-semibold text-lg">
                          +{formatPrice(extra.price_cents)}
                        </span>
                      </div>
                    </label>
                  ) : (
                    <>
                      <div className="flex items-center gap-0 rounded-full border-2 border-gray/20 bg-white flex-shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setExtraQuantities((prev) => ({
                              ...prev,
                              [extra.id]: Math.max(
                                0,
                                (prev[extra.id] ?? 0) - 1
                              ),
                            }))
                          }
                          disabled={qty <= 0}
                          className="flex h-10 w-10 items-center justify-center rounded-l-full text-xl font-bold text-black/70 transition-colors hover:bg-gray/10 hover:text-black disabled:opacity-40 disabled:pointer-events-none"
                          aria-label="Menos"
                        >
                          −
                        </button>
                        <span className="flex h-10 min-w-10 items-center justify-center px-2 text-sm font-semibold tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setExtraQuantities((prev) => {
                              const cap = extra.max_quantity ?? 99;
                              return {
                                ...prev,
                                [extra.id]: Math.min(
                                  cap,
                                  (prev[extra.id] ?? 0) + 1
                                ),
                              };
                            })
                          }
                          disabled={qty >= (extra.max_quantity ?? 99)}
                          className="flex h-10 w-10 items-center justify-center rounded-r-full text-xl font-bold text-black/70 transition-colors hover:bg-gray/10 hover:text-black disabled:opacity-40 disabled:pointer-events-none"
                          aria-label="Más"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-lg">{extra.name}</span>
                        <span className="text-green font-semibold text-lg">
                          +{formatPrice(extra.price_cents)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="p-8 rounded-xl bg-sand-light border-2 border-gray/20">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-3xl font-bold text-green">
            {formatPrice(totalCents)}
          </span>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray/20 px-4 py-3.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-gray/20 px-4 py-3.5 text-sm"
            />
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full mt-8"
          disabled={loading || totalCents <= 0}
        >
          {loading ? "Preparando pago…" : "Pagar con Stripe"}
        </Button>
      </section>
    </form>
  );
}
