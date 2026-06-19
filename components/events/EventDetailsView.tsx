import Image from "next/image";
import Link from "next/link";
import Title from "@/components/ui/Title";
import RetreatHero from "@/components/retreats/RetreatHero";
import ScrollToTopOnMount from "@/components/retreats/ScrollToTopOnMount";
import TrackMetaOnMount from "@/components/analytics/TrackMetaOnMount";

interface EventDetailsData {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  priceCents: number;
}

interface EventDetailsViewProps {
  event: EventDetailsData;
  spotsLeft: number;
  isSoldOut: boolean;
  mode?: "public" | "preview";
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function EventDetailsView({
  event,
  spotsLeft,
  isSoldOut,
  mode = "public",
}: EventDetailsViewProps) {
  const isPreview = mode === "preview";
  const imageUrl = event.image || event.images?.[0] || "/assets/placeholder.jpg";
  const galleryImages = event.images?.filter(Boolean) || [];

  return (
    <div className="pb-24">
      <ScrollToTopOnMount />
      {!isPreview && (
        <TrackMetaOnMount
          eventName="ViewContent"
          params={{
            content_ids: [event.id],
            content_name: event.title,
            content_type: "product",
          }}
        />
      )}
      {isPreview && (
        <div className="bg-violet-600 text-white py-3 px-4 text-center text-sm font-medium">
          Preview Mode - Esta versión aún no está publicada
        </div>
      )}

      <section>
        <RetreatHero
          title={event.title}
          location={event.location}
          date={event.date}
          imageUrl={imageUrl}
        />
      </section>

      {isPreview && (
        <div className="max-w-6xl mx-auto px-4 md:px-0 mt-4">
          <div className="border border-violet-200 bg-violet-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-violet-800 text-sm">Modo preview activo.</p>
            <Link
              href={`/admin/events/${event.slug}/edit`}
              className="inline-flex items-center justify-center rounded-lg bg-violet-700 text-white px-4 py-2 text-sm font-medium"
            >
              Editar evento
            </Link>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 md:px-0 py-10 md:py-14">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Title className="text-4xl text-brand-blue-medium">Sobre el evento</Title>
            {event.description && (
              <p className="text-lg text-brand-blue-dark leading-relaxed">
                {event.description}
              </p>
            )}
            {event.fullDescription && (
              <p className="text-base text-black/80 leading-relaxed whitespace-pre-line">
                {event.fullDescription}
              </p>
            )}
            {galleryImages.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {galleryImages.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-4/3 rounded-xl overflow-hidden border border-gray/10"
                  >
                    <Image
                      src={src}
                      alt={`${event.title} foto`}
                      fill
                      className="object-cover"
                      unoptimized={
                        src.startsWith("http://") || src.startsWith("https://")
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray/15 bg-white p-6 shadow-sm space-y-4">
              <p className="text-3xl font-bold text-brand-blue-dark">
                {formatPrice(event.priceCents)}
              </p>
              <p className="text-sm text-black/70">
                Pago único · sin depósitos ni saldos pendientes
              </p>
              {!isSoldOut ? (
                <>
                  <p className="text-sm font-semibold text-emerald-700">
                    {spotsLeft} {spotsLeft === 1 ? "plaza disponible" : "plazas disponibles"}
                  </p>
                  {!isPreview && (
                    <Link
                      href={`/events/${event.slug}/book`}
                      className="block w-full text-center rounded-full bg-black text-white py-3.5 font-semibold hover:bg-gray-dark transition-colors"
                    >
                      Reservar plaza
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold text-rose-700">Agotado</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
