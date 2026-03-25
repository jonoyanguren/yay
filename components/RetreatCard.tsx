"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BiCalendar, BiMap } from "react-icons/bi";
import SoldOutStamp from "@/components/ui/SoldOutStamp";

interface RetreatCardProps {
  retreat: {
    slug: string;
    title: string;
    date?: string;
    image: string;
    images: string[];
    location: string;
    description: string;
    published: boolean;
    spotsLeft?: number;
  };
}

export default function RetreatCard({ retreat }: RetreatCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const imageUrl =
    retreat.images?.[0] || retreat.image || "/assets/placeholder.jpg";
  const spotsLeft = retreat.spotsLeft;
  const isExternal =
    imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
  const isPublished = retreat.published;
  const isSoldOut = isPublished && typeof spotsLeft === "number" && spotsLeft <= 0;
  const hasAvailableSpots = isPublished && (spotsLeft ?? 0) > 0;
  const cardShellClass = hasAvailableSpots
    ? "border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
    : "border border-gray-light bg-white";
  const cardContent = (
    <div className="h-full hover:border-gray-dark/20 transition-all duration-300 flex flex-col">
      <div className="aspect-4/3 bg-gray/20 relative">
        <Image
          src={imageUrl}
          alt={`${retreat.title}, retiro de bienestar en ${retreat.location}`}
          fill
          className={`object-cover transition-transform duration-500 ${
            !isPublished || isSoldOut
              ? "grayscale"
              : "group-hover:scale-105"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={isExternal}
        />
        {!isPublished && <div className="absolute inset-0 bg-black/25" />}
        {!isPublished && (
          <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold bg-black/80 text-white shadow-md">
            Coming soon
          </span>
        )}
        {isSoldOut && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SoldOutStamp />
          </span>
        )}
        {isPublished && isNavigating && (
          <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-sm font-bold bg-black/80 text-white shadow-md">
            Abriendo...
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold group-hover:text-gray-dark transition-colors">
            {retreat.title}
          </h3>
          {hasAvailableSpots && (
            <span className="ml-3 shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
              {spotsLeft} {spotsLeft === 1 ? "plaza" : "plazas"}
            </span>
          )}
        </div>
        {retreat.date && (
          <p className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-black/70">
            <BiCalendar className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{retreat.date}</span>
          </p>
        )}
        {!isPublished && (
          <p className="text-sm font-semibold text-black/70 mb-2">
            No disponible todavía
          </p>
        )}
        <p className="text-sm text-black/60 mb-6 line-clamp-2 flex-1">
          {retreat.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray/10">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <BiMap className="h-4 w-4 shrink-0 text-black/60" aria-hidden="true" />
            <span>{retreat.location}</span>
          </span>
        </div>
      </div>
    </div>
  );

  if (!isPublished) {
    return (
      <div
        className={`group block h-full rounded-xl overflow-hidden cursor-default ${cardShellClass}`}
        aria-disabled="true"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/retreats/${retreat.slug}`}
      onClick={(event) => {
        if (isNavigating) {
          event.preventDefault();
          return;
        }
        setIsNavigating(true);
      }}
      aria-disabled={isNavigating}
      className={`group block h-full rounded-xl overflow-hidden ${cardShellClass} ${
        isNavigating ? "pointer-events-none cursor-progress opacity-90" : ""
      }`}
    >
      {cardContent}
    </Link>
  );
}
