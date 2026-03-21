"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import type { RetreatRoomTypeWithAvailability } from "@/lib/types";
import type { RetreatExtraActivityRow } from "@/lib/types";
import Button from "@/components/ui/Button";
import { trackAnalytics } from "@/lib/analytics";
import {
  BOOKING_EMAIL_INVALID_MESSAGE,
  isValidBookingEmail,
  normalizeCustomerEmail,
} from "@/lib/booking-email";
import {
  BOOKING_PHONE_INVALID_MESSAGE,
  isValidBookingPhone,
  normalizeCustomerPhone,
} from "@/lib/booking-phone";
import { cancellationPolicyFormParagraphs } from "@/lib/cancellation-policy";

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
  reservationDepositCents: number;
  chargeFullAmount: boolean;
  roomTypes: RetreatRoomTypeWithAvailability[];
  extras: RetreatExtraActivityRow[];
};

export default function BookingForm({
  retreatId,
  retreatSlug,
  retreatTitle,
  reservationDepositCents,
  chargeFullAmount,
  roomTypes,
  extras,
}: Props) {
  const didTrackBookingFormView = useRef(false);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>("");
  const [extraQuantities, setExtraQuantities] = useState<
    Record<string, number>
  >(() => Object.fromEntries(extras.map((e) => [e.id, 0])));
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailBlurError, setEmailBlurError] = useState<string | null>(null);
  const [phoneBlurError, setPhoneBlurError] = useState<string | null>(null);
  const [acceptedCancellationPolicy, setAcceptedCancellationPolicy] =
    useState(false);

  const selectedRoom = roomTypes.find((r) => r.id === selectedRoomTypeId);
  const hasValidSelectedRoom =
    Boolean(selectedRoomTypeId) &&
    Boolean(selectedRoom) &&
    (selectedRoom?.available ?? 0) > 0;
  const roomTotal = selectedRoom ? selectedRoom.price_cents : 0;
  const extrasTotal = extras.reduce(
    (sum, e) => sum + e.price_cents * (extraQuantities[e.id] ?? 0),
    0,
  );
  const bookingTotalCents = roomTotal + extrasTotal;
  const totalCents = chargeFullAmount
    ? bookingTotalCents
    : Math.min(reservationDepositCents, bookingTotalCents);

  useEffect(() => {
    if (didTrackBookingFormView.current) return;
    didTrackBookingFormView.current = true;

    trackAnalytics("ViewBookingForm", {
      content_ids: [retreatId],
      content_type: "product",
      content_name: retreatTitle,
      retreat_slug: retreatSlug,
      room_options_count: roomTypes.length,
      extras_options_count: extras.length,
    });
  }, [retreatId, retreatSlug, retreatTitle, roomTypes.length, extras.length]);

  useEffect(() => {
    if (!selectedRoomTypeId) return;
    if (selectedRoom && selectedRoom.available > 0) return;
    setSelectedRoomTypeId("");
  }, [selectedRoomTypeId, selectedRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedRoomTypeId || !email.trim()) {
      setError("Elige una habitación e indica tu email.");
      return;
    }
    const emailNorm = normalizeCustomerEmail(email);
    if (!isValidBookingEmail(emailNorm)) {
      setError(BOOKING_EMAIL_INVALID_MESSAGE);
      setEmailBlurError(BOOKING_EMAIL_INVALID_MESSAGE);
      return;
    }
    const phoneNorm = normalizeCustomerPhone(phone);
    if (!isValidBookingPhone(phoneNorm)) {
      setError(BOOKING_PHONE_INVALID_MESSAGE);
      setPhoneBlurError(BOOKING_PHONE_INVALID_MESSAGE);
      return;
    }
    if (!selectedRoom || selectedRoom.available <= 0) {
      setError("La habitación seleccionada ya no tiene plazas disponibles.");
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
          roomQuantity: 1,
          extras: extras
            .filter((e) => (extraQuantities[e.id] ?? 0) > 0)
            .map((e) => ({ id: e.id, quantity: extraQuantities[e.id] })),
          customerEmail: emailNorm,
          customerName: name.trim() || null,
          customerPhone: phoneNorm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la reserva");
        return;
      }
      if (data.url) {
        const selectedExtras = extras.filter(
          (extra) => (extraQuantities[extra.id] ?? 0) > 0,
        );

        trackAnalytics("AddPaymentInfo", {
          content_ids: [retreatId, selectedRoomTypeId],
          content_type: "product",
          currency: "EUR",
          value: totalCents / 100,
          num_items: 1,
          room_type_id: selectedRoomTypeId,
          room_type_name: selectedRoom?.name ?? "",
          extras_ids: selectedExtras.map((extra) => extra.id),
          extras_names: selectedExtras.map((extra) => extra.name),
          extras_count: selectedExtras.reduce(
            (sum, extra) => sum + (extraQuantities[extra.id] ?? 0),
            0,
          ),
          extras_total_value:
            selectedExtras.reduce(
              (sum, extra) =>
                sum + extra.price_cents * (extraQuantities[extra.id] ?? 0),
              0,
            ) / 100,
        });

        const popup = window.open(data.url, "_blank");
        if (popup) {
          popup.opener = null;
          popup.focus();
        } else {
          window.location.href = data.url;
        }
      } else {
        setError("No se recibió URL de pago");
      }
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
              className={`relative flex items-start gap-5 p-6 rounded-xl border-2 transition-colors ${
                room.available <= 0
                  ? "border-gray/10 bg-gray/5 cursor-not-allowed opacity-70"
                  : selectedRoomTypeId === room.id
                    ? "border-black bg-sand-light"
                    : "border-gray/15 bg-white hover:border-gray/30 cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="room"
                value={room.id}
                checked={selectedRoomTypeId === room.id}
                onChange={() => setSelectedRoomTypeId(room.id)}
                disabled={room.available <= 0}
                className="h-5 w-5 shrink-0 accent-black cursor-pointer mt-1"
              />

              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-semibold text-lg">{room.name}</span>
                  {room.images && room.images.length > 0 && (
                    <ImageGallery
                      images={room.images}
                      altPrefix={room.name}
                      variant="button"
                      buttonLabel="Ver fotos"
                      className="shrink-0"
                    />
                  )}
                </div>
                {room.description && (
                  <span className="text-sm text-black/70 mt-1 block">
                    {room.description}
                  </span>
                )}
                <span className="text-xl mt-2 font-semibold text-green">
                  {formatPrice(room.price_cents)}
                </span>
                <span className="text-sm mt-1 text-black/60">
                  {room.available <= 0
                    ? "Completa"
                    : `${room.available} ${room.available === 1 ? "plaza" : "plazas"} disponibles`}
                </span>
              </div>
            </label>
          ))}
        </div>
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
                  className={`flex items-start gap-5 p-6 rounded-xl border-2 transition-colors ${
                    qty > 0
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
                        className="h-5 w-5 shrink-0 rounded border-2 border-gray/30 accent-black cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium text-lg">
                            {extra.name}
                          </span>
                          <span className="flex items-center gap-3 shrink-0">
                            {extra.images && extra.images.length > 0 && (
                              <ImageGallery
                                images={extra.images}
                                altPrefix={extra.name}
                                variant="button"
                                buttonLabel="Ver fotos"
                                className="shrink-0"
                              />
                            )}
                            <span className="text-green font-semibold text-lg">
                              +{formatPrice(extra.price_cents)}
                            </span>
                          </span>
                        </div>
                        {extra.description && (
                          <span className="text-sm text-black/70 block mt-1">
                            {extra.description}
                          </span>
                        )}
                        {extra.link && (
                          <a
                            href={extra.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green hover:underline mt-1 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 Más información
                          </a>
                        )}
                      </div>
                    </label>
                  ) : (
                    <>
                      <div className="flex items-center gap-0 rounded-full border-2 border-gray/20 bg-white shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setExtraQuantities((prev) => ({
                              ...prev,
                              [extra.id]: Math.max(
                                0,
                                (prev[extra.id] ?? 0) - 1,
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
                                  (prev[extra.id] ?? 0) + 1,
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
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium text-lg">
                            {extra.name}
                          </span>
                          <span className="flex items-center gap-3 shrink-0">
                            {extra.images && extra.images.length > 0 && (
                              <ImageGallery
                                images={extra.images}
                                altPrefix={extra.name}
                                variant="button"
                                buttonLabel="Ver fotos"
                                className="shrink-0"
                              />
                            )}
                            <span className="text-green font-semibold text-lg">
                              +{formatPrice(extra.price_cents)}
                            </span>
                          </span>
                        </div>
                        {extra.description && (
                          <span className="text-sm text-black/70 block mt-1">
                            {extra.description}
                          </span>
                        )}
                        {extra.link && (
                          <a
                            href={extra.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green hover:underline mt-1 inline-block"
                          >
                            🔗 Más información
                          </a>
                        )}
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
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total de la reserva</span>
            <span className="text-3xl font-bold text-green">
              {formatPrice(bookingTotalCents)}
            </span>
          </div>
          {!chargeFullAmount && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">
                  A pagar ahora (reserva)
                </span>
                <span className="text-3xl font-bold text-green">
                  {formatPrice(totalCents)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60">Pendiente</span>
                <span className="text-sm font-medium text-black/70">
                  {formatPrice(Math.max(0, bookingTotalCents - totalCents))}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="mb-6 rounded-lg bg-white/70 border border-gray/20 p-4 space-y-2">
          <p className="text-sm text-black/70">
            {chargeFullAmount
              ? "Este retiro se cobra al completo en un único pago."
              : "Este pago confirma tu plaza. Hoy se cobra el menor importe entre la señal y el total de tu reserva."}
          </p>
          {!chargeFullAmount && (
            <p className="text-sm text-black/70">
              El importe pendiente se cobrará por factura aproximadamente 1 mes
              antes del retiro.
            </p>
          )}
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onFocus={() => setEmailBlurError(null)}
              onChange={(e) => {
                const v = e.target.value;
                setEmail(v);
                const t = normalizeCustomerEmail(v);
                if (t.length === 0 || isValidBookingEmail(t)) {
                  setEmailBlurError(null);
                }
              }}
              onBlur={() => {
                const t = normalizeCustomerEmail(email);
                if (t.length === 0) {
                  setEmailBlurError(null);
                  return;
                }
                setEmailBlurError(
                  isValidBookingEmail(t) ? null : BOOKING_EMAIL_INVALID_MESSAGE,
                );
              }}
              placeholder="tu@email.com"
              aria-invalid={emailBlurError ? true : undefined}
              className={`w-full rounded-lg border px-4 py-3.5 text-sm ${
                emailBlurError
                  ? "border-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
                  : "border-gray/20"
              }`}
            />
            {emailBlurError ? (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {emailBlurError}
              </p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Teléfono (WhatsApp) *
            </label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              value={phone}
              onFocus={() => setPhoneBlurError(null)}
              onChange={(e) => {
                const v = e.target.value;
                setPhone(v);
                const t = normalizeCustomerPhone(v);
                if (t.length === 0 || isValidBookingPhone(t)) {
                  setPhoneBlurError(null);
                }
              }}
              onBlur={() => {
                const t = normalizeCustomerPhone(phone);
                if (t.length === 0) {
                  setPhoneBlurError(null);
                  return;
                }
                setPhoneBlurError(
                  isValidBookingPhone(t) ? null : BOOKING_PHONE_INVALID_MESSAGE,
                );
              }}
              placeholder="+34 600 000 000"
              aria-invalid={phoneBlurError ? true : undefined}
              className={`w-full rounded-lg border px-4 py-3.5 text-sm ${
                phoneBlurError
                  ? "border-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
                  : "border-gray/20"
              }`}
            />
            {phoneBlurError ? (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {phoneBlurError}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-black/65 leading-relaxed">
              La mayor parte de la coordinación del retiro la hacemos por
              WhatsApp. Necesitamos tu número para enviarte detalles prácticos,
              el grupo y cualquier incidencia antes y durante la experiencia.
            </p>
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
        <div className="mt-6 rounded-lg bg-white/70 border border-gray/20 p-4 space-y-3">
          <p className="text-sm font-medium text-black">
            Política de cancelación
          </p>
          {cancellationPolicyFormParagraphs().map((line) => (
            <p key={line} className="text-sm text-black/70">
              {line}
            </p>
          ))}
          <p className="text-sm text-black/70">
            Los plazos son días naturales hasta el día de inicio del retiro.{" "}
            <Link
              href="/terminos"
              className="text-black underline underline-offset-2 hover:text-black/80"
            >
              Términos y condiciones
            </Link>{" "}
            (texto legal completo, supuestos especiales y tramitación de
            reembolsos).
          </p>
          <label className="flex items-start gap-3 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedCancellationPolicy}
              onChange={(e) => setAcceptedCancellationPolicy(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray/30 accent-black cursor-pointer"
            />
            <span className="text-sm text-black/80">
              He leído y acepto la política de cancelación.
            </span>
          </label>
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
          disabled={
            loading ||
            totalCents <= 0 ||
            !acceptedCancellationPolicy ||
            !hasValidSelectedRoom ||
            Boolean(emailBlurError) ||
            Boolean(phoneBlurError)
          }
        >
          {loading
            ? "Preparando pago…"
            : !hasValidSelectedRoom
              ? "Selecciona una habitación"
              : "Pagar con Stripe"}
        </Button>
      </section>
    </form>
  );
}
