"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploadWidget from "./ImageUploadWidget";
import type { EventRow } from "@/lib/types";

interface EventFormProps {
  event?: EventRow;
  isEdit?: boolean;
}

/** Convierte céntimos a texto para el input sin artefactos de coma flotante. */
function formatCentsAsEurosInput(cents: number): string {
  const whole = Math.floor(cents / 100);
  const frac = cents % 100;
  if (frac === 0) return String(whole);
  return `${whole}.${frac.toString().padStart(2, "0")}`;
}

/** Convierte euros (string o número) a céntimos enteros. */
function parseEurosToCents(value: string | number): number {
  const normalized = String(value).trim().replace(",", ".");
  const euros = parseFloat(normalized);
  if (!Number.isFinite(euros) || euros < 0) return 0;
  return Math.round(euros * 100);
}

const inputClass =
  "w-full px-4 py-2.5 !bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow [color-scheme:light]";

const checkboxClass =
  "h-4 w-4 shrink-0 rounded border-slate-300 !bg-white text-emerald-600 focus:ring-emerald-500";

export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    slug: event?.slug || "",
    title: event?.title || "",
    location: event?.location || "",
    description: event?.description || "",
    fullDescription: event?.fullDescription || "",
    date: event?.date || "",
    priceEuros: event ? formatCentsAsEurosInput(event.priceCents) : "",
    maxAttendees: event?.maxAttendees ?? 20,
    published: event?.published ?? !isEdit,
    hideFromWeb: event?.hideFromWeb ?? false,
    forceSoldOut: event?.forceSoldOut || false,
  });

  const [coverImage, setCoverImage] = useState(event?.image || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    (event?.images || []).slice(0, 2),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const payload = {
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      fullDescription: formData.fullDescription.trim(),
      date: formData.date.trim(),
      image: coverImage,
      images: galleryImages.slice(0, 2),
      priceCents: parseEurosToCents(formData.priceEuros),
      maxAttendees: Math.max(1, Number(formData.maxAttendees) || 1),
      published: formData.published,
      hideFromWeb: formData.hideFromWeb,
      forceSoldOut: formData.forceSoldOut,
    };

    try {
      const url = isEdit
        ? `/api/admin/events/${event?.slug}`
        : "/api/admin/events";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al guardar el evento");
        return;
      }

      setSuccessMessage(
        isEdit ? "Evento actualizado correctamente." : "Evento creado correctamente.",
      );
      if (!isEdit) {
        router.push(`/admin/events/${data.slug}/edit`);
      }
    } catch {
      setError("Error de conexión al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Información básica</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Fecha
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="15 junio 2026"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Descripción corta
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Descripción completa
          </label>
          <textarea
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            rows={6}
            className={inputClass}
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Precio y plazas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Precio (EUR)
            </label>
            <input
              type="text"
              inputMode="decimal"
              name="priceEuros"
              placeholder="12"
              value={formData.priceEuros}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Plazas máximas
            </label>
            <input
              type="number"
              name="maxAttendees"
              min={1}
              value={formData.maxAttendees}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Imágenes</h2>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Portada
          </label>
          {coverImage && (
            <div className="relative w-full max-w-md aspect-video mb-3 rounded-lg overflow-hidden">
              <Image src={coverImage} alt="Portada" fill className="object-cover" unoptimized />
            </div>
          )}
          <ImageUploadWidget
            folder="events"
            onUpload={(url) => setCoverImage(url)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Fotos adicionales (máx. 2)
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            {galleryImages.map((url) => (
              <div key={url} className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() =>
                    setGalleryImages((prev) => prev.filter((u) => u !== url))
                  }
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          {galleryImages.length < 2 && (
            <ImageUploadWidget
              folder="events"
              onUpload={(url) =>
                setGalleryImages((prev) =>
                  prev.includes(url) || prev.length >= 2 ? prev : [...prev, url],
                )
              }
            />
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Visibilidad</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className={checkboxClass}
          />
          <span className="text-sm text-slate-700">Publicado</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="hideFromWeb"
            checked={formData.hideFromWeb}
            onChange={handleChange}
            className={checkboxClass}
          />
          <span className="text-sm text-slate-700">Ocultar de la web</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="forceSoldOut"
            checked={formData.forceSoldOut}
            onChange={handleChange}
            className={checkboxClass}
          />
          <span className="text-sm text-slate-700">Forzar agotado</span>
        </label>
      </section>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading
          ? "Guardando..."
          : isEdit
            ? "Actualizar evento"
            : "Crear evento"}
      </button>
    </form>
  );
}
