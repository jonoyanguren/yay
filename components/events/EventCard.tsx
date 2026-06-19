"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BiCalendar, BiMap } from "react-icons/bi";
import SoldOutStamp from "@/components/ui/SoldOutStamp";

interface EventCardProps {
  event: {
    slug: string;
    title: string;
    date?: string;
    image: string;
    images: string[];
    location: string;
    description: string;
    published: boolean;
    priceCents: number;
    spotsLeft?: number;
  };
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function EventCard({ event }: EventCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const imageUrl = event.images?.[0] || event.image || "/assets/placeholder.jpg";
  const spotsLeft = event.spotsLeft;
  const isExternal =
    imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
  const isPublished = event.published;
  const isSoldOut = isPublished && typeof spotsLeft === "number" && spotsLeft <= 0;
  const hasAvailableSpots = isPublished && (spotsLeft ?? 0) > 0;

  const cardContent = (
    <div className="h-full hover:border-gray-dark/20 transition-all duration-300 flex flex-col">
      <div className="aspect-4/3 bg-gray/20 relative">
        <Image
          src={imageUrl}
          alt={`${event.title}, evento en ${event.location}`}
          fill
          className={`object-cover transition-transform duration-500 ${
            !isPublished || isSoldOut ? "grayscale" : "group-hover:scale-105"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={isExternal}
        />
        {isSoldOut && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SoldOutStamp />
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-3">
          <h3 className="text-xl font-bold group-hover:text-gray-dark transition-colors">
            {event.title}
          </h3>
          {hasAvailableSpots && (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
              {spotsLeft} {spotsLeft === 1 ? "plaza" : "plazas"}
            </span>
          )}
        </div>
        {event.date && (
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-black/70">
            <BiCalendar className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{event.date}</span>
          </p>
        )}
        <p className="text-sm text-black/60 mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray/10">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <BiMap className="h-4 w-4 shrink-0 text-black/60" aria-hidden="true" />
            <span>{event.location}</span>
          </span>
          <span className="text-sm font-bold">{formatPrice(event.priceCents)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Link
      href={`/events/${event.slug}`}
      onClick={(e) => {
        if (isNavigating) {
          e.preventDefault();
          return;
        }
        setIsNavigating(true);
      }}
      className={`group block h-full rounded-xl overflow-hidden border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${
        isNavigating ? "pointer-events-none cursor-progress opacity-90" : ""
      }`}
    >
      {cardContent}
    </Link>
  );
}
