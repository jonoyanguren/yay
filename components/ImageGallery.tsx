"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Title from "./ui/Title";

export type ImageGalleryVariant =
  | "full"
  | "compact"
  | "button"
  | "stack-parallax";

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
    variant === "compact" && compactSize === "sm" ? "w-16 h-16" : "w-20 h-20";
  const thumbSizes = compactSize === "sm" ? "64px" : "80px";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [horizontalTravel, setHorizontalTravel] = useState(0);
  const [horizontalSectionHeight, setHorizontalSectionHeight] = useState(1800);
  const shouldReduceMotion = useReducedMotion();
  const stackRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });
  const horizontalStopProgress = 0.78;
  const horizontalX = useTransform(scrollYProgress, (value) => {
    const normalized = Math.min(value / horizontalStopProgress, 1);
    return -normalized * horizontalTravel;
  });
  const cardsFadeOut = useTransform(
    scrollYProgress,
    [horizontalStopProgress, 0.95],
    [1, 0],
  );
  const finalCardScale = useTransform(
    scrollYProgress,
    [horizontalStopProgress, 1],
    [1, 1.06],
  );
  const finalCardY = useTransform(scrollYProgress, [horizontalStopProgress, 1], [0, 34]);

  const open = useCallback((index: number) => setLightboxIndex(index), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(
    () =>
    setLightboxIndex((i) =>
      i === null ? null : i === 0 ? images.length - 1 : i - 1,
    ),
    [images.length],
  );
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
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
  }, [lightboxIndex, images.length, goPrev, goNext, close]);

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

  useEffect(() => {
    if (variant !== "stack-parallax") return;

    const updateMetrics = () => {
      const section = stackRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const viewportWidth = section.clientWidth;
      const totalTrackWidth = track.scrollWidth;
      const neededTravel = Math.max(0, totalTrackWidth - viewportWidth);
      const viewportHeight = window.innerHeight || 900;
      const finalCard = track.lastElementChild as HTMLElement | null;
      const targetTravelToCenter = finalCard
        ? finalCard.offsetLeft + finalCard.offsetWidth / 2 - viewportWidth / 2
        : neededTravel;
      const effectiveTravel = Math.max(
        0,
        Math.min(neededTravel, targetTravelToCenter),
      );
      // Extra vertical runway after centering final card so others can fade out.
      const postCenterRunway = viewportHeight * 0.38;
      const sectionHeight = Math.max(
        1200,
        viewportHeight + effectiveTravel + postCenterRunway,
      );

      setHorizontalTravel(effectiveTravel);
      setHorizontalSectionHeight(sectionHeight);
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [variant, images.length]);

  if (images.length === 0) return null;

  const alt = (i: number) =>
    altPrefix ? `${altPrefix} - Imagen ${i + 1}` : `Imagen ${i + 1}`;

  const canUseStackLayout =
    variant === "stack-parallax" &&
    !shouldReduceMotion &&
    images.length > 0;

  return (
    <>
      {(title || imageCountLabel) && (
        <div className="mb-4">
          {title && <Title className="text-2xl">{title}</Title>}
          {imageCountLabel && (
            <p className="text-black/60 text-sm mt-1">{imageCountLabel}</p>
          )}
        </div>
      )}

      {variant === "stack-parallax" ? (
        canUseStackLayout ? (
          <>
            <div className={`md:hidden grid grid-cols-2 gap-3 ${className}`}>
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => open(index)}
                  className="relative w-full rounded-xl overflow-hidden border border-gray/10 shadow-sm bg-slate-100 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  style={{ paddingBottom: "75%" }}
                >
                  <Image
                    src={img}
                    alt={alt(index)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </button>
              ))}
            </div>

            <div
              ref={stackRef}
              className={`relative hidden md:block ${className}`}
              style={{ height: `${horizontalSectionHeight}px` }}
            >
              <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                  ref={trackRef}
                  style={{ x: horizontalX }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-6 md:gap-8 lg:gap-10 pl-[8vw] pr-[36vw]"
                >
                  {images.map((img, index) => {
                    return (
                      <motion.button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => open(index)}
                        className="relative aspect-square w-[36vw] max-w-[420px] rounded-2xl overflow-hidden border border-white/25 shadow-xl bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shrink-0"
                        style={{ opacity: cardsFadeOut }}
                      >
                        <Image
                          src={img}
                          alt={alt(index)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1200px) 36vw, 420px"
                          priority={index === 0}
                        />
                      </motion.button>
                    );
                  })}
                  <motion.div
                    style={{ scale: finalCardScale, y: finalCardY }}
                    className="relative aspect-square w-[36vw] max-w-[420px] rounded-2xl border border-black/10 shadow-xl bg-black text-white shrink-0 flex items-center justify-center p-6"
                  >
                    <motion.div
                      className="flex flex-col items-center justify-center gap-2"
                      animate={{ y: [0, 7, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <p className="text-3xl md:text-4xl font-semibold tracking-tight text-center leading-tight">
                        Quiero esto!
                      </p>
                      <span className="text-3xl leading-none">↓</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </>
        ) : (
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
        )
      ) : variant === "full" ? (
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
