"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export type ImageGalleryVariant = "full" | "compact" | "button";

export interface ImageGalleryProps {
  images: string[];
  altPrefix?: string;
  variant?: ImageGalleryVariant;
  /** Solo para variant="compact": "md" = 80px, "sm" = 64px */
  compactSize?: "md" | "sm";
  /** Solo para variant="button": texto del botón */
  buttonLabel?: string;
  title?: string;
  imageCountLabel?: string;
  className?: string;
}

export default function ImageGallery({
  images,
  altPrefix = "",
  variant = "full",
  compactSize = "md",
  buttonLabel = "Ver fotos",
  title,
  imageCountLabel,
  className = "",
}: ImageGalleryProps) {
  const thumbClass =
    variant === "compact" && compactSize === "sm"
      ? "w-16 h-16"
      : "w-20 h-20";
  const thumbSizes = compactSize === "sm" ? "64px" : "80px";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (index: number) => setLightboxIndex(index);
  const close = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((i) =>
      i === null ? null : i === 0 ? images.length - 1 : i - 1
    );
  const goNext = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % images.length
    );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  if (images.length === 0) return null;

  const alt = (i: number) =>
    altPrefix ? `${altPrefix} - Imagen ${i + 1}` : `Imagen ${i + 1}`;

  return (
    <>
      {(title || imageCountLabel) && (
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {imageCountLabel && (
            <p className="text-black/60 text-sm mt-1">{imageCountLabel}</p>
          )}
        </div>
      )}

      {variant === "full" ? (
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 ${className}`}
        >
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => open(index)}
              className="relative w-full rounded-xl overflow-hidden border border-gray/10 shadow-sm hover:shadow-lg transition-all bg-slate-100 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              style={{ paddingBottom: "75%" }}
            >
              <Image
                src={img}
                alt={alt(index)}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </button>
          ))}
        </div>
      ) : variant === "button" ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            open(0);
          }}
          className={`text-sm font-medium text-green hover:text-green/80 underline focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-1 rounded ${className}`}
        >
          {buttonLabel} {images.length > 1 && `(${images.length})`}
        </button>
      ) : (
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => open(index)}
              className={`relative ${thumbClass} rounded-lg overflow-hidden border border-gray/10 bg-slate-100 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1`}
            >
              <Image
                src={img}
                alt={alt(index)}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                sizes={thumbSizes}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Ver imagen completa"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-colors"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-colors"
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative max-w-6xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={alt(lightboxIndex)}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            />
          </div>

          {images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {lightboxIndex + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
