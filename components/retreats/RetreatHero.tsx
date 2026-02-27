import Link from "next/link";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";

interface RetreatHeroProps {
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  maxPeople: number;
  spotsLeft: number;
  bookingHref: string;
}

export default function RetreatHero({
  title,
  location,
  date,
  imageUrl,
  maxPeople,
  spotsLeft,
  bookingHref,
}: RetreatHeroProps) {
  return (
    <div
      className="h-[60vh] bg-gray/20 relative flex items-end pb-12 px-4 md:px-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-6 md:top-8 left-4 right-4 md:left-12 md:right-12 z-20">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/#retreats"
            className="text-white/80 hover:text-white text-sm block"
          >
            &larr; Volver a Retiros
          </Link>
        </div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <Title className="text-4xl md:text-6xl text-white mb-2">{title}</Title>
        <p className="text-xl text-white/90 flex items-center gap-2">
          <span>{location}</span>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          <span>{date}</span>
        </p>
      </div>
      <div className="absolute left-4 right-4 md:left-12 md:right-12 -top-20 z-20 hidden md:block">
        <div className="max-w-6xl mx-auto">
          <div className="ml-auto w-full max-w-sm translate-y-1/2 p-6 bg-sand-light border border-gray/20 rounded-xl shadow-sm space-y-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Fechas</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Ubicación</span>
                <span className="font-medium text-right">{location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Grupo</span>
                <span className="font-medium">Max {maxPeople} personas</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Plazas</span>
                <span className="font-medium">
                  Quedan {spotsLeft} de {maxPeople} plazas
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg" href={bookingHref}>
              Reservar plaza
            </Button>
            <p className="text-xs text-center text-black/40">
              Elige habitación y extras; pago seguro con Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
