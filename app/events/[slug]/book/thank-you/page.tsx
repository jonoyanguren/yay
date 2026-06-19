import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EventPurchaseOnThankYouTracker from "@/components/analytics/EventPurchaseOnThankYouTracker";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug, published: true, hideFromWeb: false },
    select: { slug: true, title: true },
  });
}

export default async function EventThankYouPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { session_id } = await searchParams;
  const event = await getEventBySlug(slug);

  return (
    <div className="px-4 md:px-12 max-w-xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Inscripción recibida</h1>
      <p className="text-black/70 mb-8">
        Gracias por apuntarte. Si el pago se ha completado correctamente, te
        hemos enviado un email de confirmación.
      </p>
      {session_id && (
        <p className="text-xs text-black/50 mb-6">
          Referencia: {session_id.slice(0, 20)}…
        </p>
      )}
      {session_id ? (
        <EventPurchaseOnThankYouTracker sessionId={session_id} />
      ) : null}
      <Link
        href={event ? `/events/${slug}` : "/events"}
        className="inline-flex items-center justify-center rounded-full font-medium bg-black text-white hover:bg-gray-dark h-11 px-8 text-sm"
      >
        {event ? `Volver a ${event.title}` : "Ver eventos"}
      </Link>
    </div>
  );
}
