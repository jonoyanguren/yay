import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEventCapacity } from "@/lib/event-capacity";
import EventBookingForm from "@/components/events/EventBookingForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventBookPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, published: true, hideFromWeb: false },
  });
  if (!event) notFound();

  const { isSoldOut } = await getEventCapacity(event.id);

  if (isSoldOut) {
    return (
      <div className="px-4 md:px-12 max-w-xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Plazas agotadas</h1>
        <p className="text-black/70 mb-8">
          Este evento ya no tiene plazas disponibles.
        </p>
        <Link
          href={`/events/${slug}`}
          className="inline-flex rounded-full bg-black text-white px-6 py-3 text-sm font-medium"
        >
          Volver al evento
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 max-w-2xl mx-auto py-12 md:py-16">
      <h1 className="text-3xl font-bold mb-2">Reserva tu plaza</h1>
      <p className="text-black/70 mb-8">{event.title}</p>
      <EventBookingForm
        eventId={event.id}
        eventSlug={event.slug}
        eventTitle={event.title}
        priceCents={event.priceCents}
      />
    </div>
  );
}
