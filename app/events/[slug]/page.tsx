import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEventCapacity } from "@/lib/event-capacity";
import EventDetailsView from "@/components/events/EventDetailsView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug, published: true, hideFromWeb: false },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return { title: "Evento no encontrado" };
  }
  return {
    title: `${event.title} | Eventos YaY`,
    description: event.description || `Evento de un día: ${event.title}`,
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const { spotsLeft, isSoldOut } = await getEventCapacity(event.id);

  return (
    <EventDetailsView
      event={event}
      spotsLeft={spotsLeft}
      isSoldOut={isSoldOut}
    />
  );
}
