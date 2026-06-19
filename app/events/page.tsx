import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getEventSpotsLeftMap } from "@/lib/event-capacity";
import EventCard from "@/components/events/EventCard";
import Title from "@/components/ui/Title";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos de día | YaY experiences",
  description:
    "Experiencias de un día: bienestar, movimiento y desconexión con pago único y plazas limitadas.",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true, hideFromWeb: false },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const spotsMap = await getEventSpotsLeftMap(events.map((e) => e.id));

  return (
    <div className="px-4 md:px-12 max-w-6xl mx-auto py-12 md:py-20">
      <Title className="text-5xl md:text-6xl mb-4 text-brand-blue-medium">
        Eventos
      </Title>
      <p className="text-lg text-black/70 mb-10 max-w-2xl">
        Jornadas puntuales para desconectar, moverte y recargar. Reserva tu plaza
        con un pago único.
      </p>

      {events.length === 0 ? (
        <p className="text-black/60">Próximamente publicaremos nuevos eventos.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={{
                ...event,
                spotsLeft: spotsMap.get(event.id) ?? 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
