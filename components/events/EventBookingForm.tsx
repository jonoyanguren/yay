"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
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

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

type Props = {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  priceCents: number;
};

const inputClass =
  "w-full rounded-lg border border-gray/20 px-4 py-3.5 text-sm !bg-white text-black placeholder:text-black/40 [color-scheme:light] focus-visible:outline-2 focus-visible:outline-black/20";

export default function EventBookingForm({
  eventId,
  eventSlug,
  eventTitle,
  priceCents,
}: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailNorm = normalizeCustomerEmail(email);
    if (!isValidBookingEmail(emailNorm)) {
      setError(BOOKING_EMAIL_INVALID_MESSAGE);
      return;
    }
    const phoneNorm = normalizeCustomerPhone(phone);
    if (!isValidBookingPhone(phoneNorm)) {
      setError(BOOKING_PHONE_INVALID_MESSAGE);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/events/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          slug: eventSlug,
          customerEmail: emailNorm,
          customerName: name.trim() || null,
          customerPhone: phoneNorm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "No se pudo iniciar el pago");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="rounded-xl border border-gray/15 bg-white p-5">
        <p className="text-sm text-black/60 mb-1">Evento</p>
        <p className="font-semibold text-lg">{eventTitle}</p>
        <p className="mt-3 text-2xl font-bold">{formatPrice(priceCents)}</p>
        <p className="text-sm text-black/60 mt-1">Pago único en Stripe</p>
      </div>

      <section className="rounded-xl border border-gray/15 bg-white p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="event-name">
            Nombre
          </label>
          <input
            id="event-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Tu nombre"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="event-email">
            Email *
          </label>
          <input
            id="event-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="tu@email.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="event-phone">
            Teléfono *
          </label>
          <input
            id="event-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="+34 600 000 000"
            autoComplete="tel"
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Redirigiendo a Stripe..." : `Pagar ${formatPrice(priceCents)}`}
      </Button>

      <p className="text-xs text-black/50">
        Al continuar serás redirigido a Stripe para completar el pago de forma segura.
      </p>
      <Link
        href={`/events/${eventSlug}`}
        className="inline-block text-sm text-black/60 hover:text-black"
      >
        &larr; Volver al evento
      </Link>
    </form>
  );
}
