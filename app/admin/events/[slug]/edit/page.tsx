"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import EventForm from "../../../components/EventForm";
import type { EventRow } from "@/lib/types";

export default function EditEventPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<EventRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/admin/events/${slug}`);
        if (res.ok) {
          setEvent(await res.json());
        } else {
          setError("Evento no encontrado");
        }
      } catch {
        setError("Error de conexión");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-rose-700">{error || "Evento no encontrado"}</p>
        <Link href="/admin/events" className="mt-4 inline-block text-slate-600">
          &larr; Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/events" className="text-slate-600 hover:text-slate-800 text-sm">
          &larr; Eventos
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-4 mb-8">Editar evento</h1>
        <EventForm event={event} isEdit />
      </div>
    </div>
  );
}
