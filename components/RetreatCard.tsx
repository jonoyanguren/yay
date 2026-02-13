import Link from "next/link";
import Image from "next/image";
import { Retreat } from "@/lib/data";

interface RetreatCardProps {
  retreat: Retreat & { spotsLeft?: number };
}

export default function RetreatCard({ retreat }: RetreatCardProps) {
  const imageUrl =
    retreat.images?.[0] || retreat.image || "/assets/placeholder.jpg";
  const spotsLeft = retreat.spotsLeft;
  const isExternal = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  return (
    <Link
      href={`/retreats/${retreat.slug}`}
      className="group block h-full rounded-xl overflow-hidden"
    >
      <div className="bg-sand-light h-full hover:border-gray-dark/20 transition-all duration-300 flex flex-col">
        <div className="aspect-4/3 bg-gray/20 relative">
          <Image
            src={imageUrl}
            alt={retreat.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={isExternal}
          />
          {typeof spotsLeft === "number" && (
            <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold bg-emerald-500 text-white shadow-md">
              {spotsLeft} {spotsLeft === 1 ? "plaza" : "plazas"} disponibles
            </span>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold group-hover:text-gray-dark transition-colors">
              {retreat.title}
            </h3>
          </div>
          <p className="text-sm text-black/60 mb-6 line-clamp-3 flex-1">
            {retreat.description}
          </p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray/10">
            <span className="text-sm font-medium">{retreat.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
