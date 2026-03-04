"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface RetreatCardProps {
  retreat: {
    slug: string;
    title: string;
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
  const isExternal = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
  const isPublished = retreat.published;
  const cardContent = (
    <div className="bg-sand-light h-full hover:border-gray-dark/20 transition-all duration-300 flex flex-col">
      <div className="aspect-4/3 bg-gray/20 relative">
        <Image
          src={imageUrl}
          alt={retreat.title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isPublished ? "group-hover:scale-105" : "grayscale"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={isExternal}
        />
        {!isPublished && <div className="absolute inset-0 bg-black/25" />}
        {!isPublished && (
          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-sm font-bold bg-black/80 text-white shadow-md">
            Coming soon
          </span>
        )}
        {isPublished && typeof spotsLeft === "number" && (
          <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold bg-emerald-500 text-white shadow-md">
            {spotsLeft <= 0
              ? "No quedan plazas"
              : `${spotsLeft} ${spotsLeft === 1 ? "plaza" : "plazas"} disponibles`}
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
        </div>
        {!isPublished && (
          <p className="text-sm font-semibold text-black/70 mb-2">No disponible todavía</p>
        )}
        <p className="text-sm text-black/60 mb-6 line-clamp-3 flex-1">
          {retreat.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray/10">
          <span className="text-sm font-medium">{retreat.location}</span>
        </div>
      </div>
    </div>
  );

  if (!isPublished) {
    return (
      <div
        className="group block h-full rounded-xl overflow-hidden cursor-default"
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
      className={`group block h-full rounded-xl overflow-hidden ${
        isNavigating ? "pointer-events-none cursor-progress opacity-90" : ""
      }`}
    >
      {cardContent}
    </Link>
  );
}
