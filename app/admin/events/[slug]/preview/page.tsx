import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEventCapacity } from "@/lib/event-capacity";
import EventDetailsView from "@/components/events/EventDetailsView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) notFound();

  const { spotsLeft, isSoldOut } = await getEventCapacity(event.id);

  return (
    <EventDetailsView
      event={event}
      spotsLeft={spotsLeft}
      isSoldOut={isSoldOut}
      mode="preview"
    />
  );
}
