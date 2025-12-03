import Link from "next/link";
import { Retreat } from "@/lib/data";

interface RetreatCardProps {
  retreat: Retreat;
}

export default function RetreatCard({ retreat }: RetreatCardProps) {
  return (
    <Link href={`/retreats/${retreat.slug}`} className="group block h-full">
      <div className="bg-sand-light h-full overflow-hidden border border-transparent hover:border-gray-dark/20 transition-all duration-300 flex flex-col">
        <div className="aspect-[4/3] bg-gray/20 relative overflow-hidden">
          {/* Placeholder for image */}
          <div className="absolute inset-0 bg-gray/30 flex items-center justify-center text-gray-dark/50 group-hover:scale-105 transition-transform duration-500">
            {retreat.title} Image
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold group-hover:text-gray-dark transition-colors">
              {retreat.title}
            </h3>
            <span className="text-xs font-medium bg-sand px-2 py-1 rounded-full">
              {retreat.date}
            </span>
          </div>
          <p className="text-sm text-black/60 mb-6 line-clamp-3 flex-1">
            {retreat.description}
          </p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray/10">
            <span className="text-sm font-medium">{retreat.location}</span>
            <span className="text-sm font-bold">{retreat.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
