import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRoomTypesWithAvailability } from "@/lib/retreat-capacity";
import BookingForm from "./BookingForm";
import { RESERVATION_PAYMENT_CENTS } from "@/lib/stripe-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getRetreatBySlug(slug: string) {
  try {
    const retreat = await prisma.retreat.findUnique({
      where: {
        slug,
        published: true,
      },
    });
    return retreat;
  } catch (error) {
    console.error("Error fetching retreat:", error);
    return null;
  }
}

async function getExtraActivities(retreatId: string) {
  const rows = await prisma.retreatExtraActivity.findMany({
    where: { retreatId },
    orderBy: { priceCents: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    retreat_id: r.retreatId,
    name: r.name,
    description: r.description,
    images: (r as { images: string[] }).images || [],
    price_cents: r.priceCents,
    allow_multiple:
      "allowMultiple" in r
        ? (r as { allowMultiple: boolean }).allowMultiple
        : true,
    max_quantity: (r as { maxQuantity: number | null }).maxQuantity ?? null,
    link: (r as { link: string | null }).link ?? null,
  }));
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);
  const reservationDepositCents = Number(
    (retreat as Record<string, unknown>).reservationDepositCents ??
      RESERVATION_PAYMENT_CENTS,
  );
  const chargeFullAmount = Boolean(
    (retreat as Record<string, unknown>).chargeFullAmount ?? false,
  );


  if (!retreat) {
    notFound();
  }

  const [roomTypes, extras] = await Promise.all([
    getRoomTypesWithAvailability(retreat.id),
    getExtraActivities(retreat.id),
  ]);
  const totalAvailable = roomTypes.reduce((sum, room) => sum + room.available, 0);
  const isSoldOut = roomTypes.length > 0 && totalAvailable <= 0;

  if (isSoldOut) {
    return (
      <div className="px-4 md:px-12 max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No quedan plazas</h1>
        <p className="text-black/70 mb-6">
          Todas las tipologias de habitacion estan completas.
        </p>
        <Link
          href={`/retreats/${slug}`}
          className="text-green font-medium hover:underline"
        >
          Volver al retiro
        </Link>
      </div>
    );
  }

  if (roomTypes.length === 0) {
    return (
      <div className="px-4 md:px-12 max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Reservas no disponibles</h1>
        <p className="text-black/70 mb-6">
          Este retiro no tiene opciones de reserva configuradas todavía.
        </p>
        <Link
          href={`/retreats/${slug}`}
          className="text-green font-medium hover:underline"
        >
          Volver al retiro
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="px-4 md:px-12 max-w-4xl mx-auto pt-8">
        <Link
          href={`/retreats/${slug}`}
          className="text-black/60 hover:text-black text-sm mb-6 inline-block"
        >
          &larr; Volver a {retreat.title}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Reservar plaza – {retreat.title}
        </h1>
        <p className="text-black/70 mb-10">
          Elige tu habitación y opciones. El pago se realiza de forma segura con
          Stripe.
        </p>
        <BookingForm
          retreatId={retreat.id}
          retreatSlug={retreat.slug}
          retreatTitle={retreat.title}
          reservationDepositCents={reservationDepositCents}
          chargeFullAmount={chargeFullAmount}
          roomTypes={roomTypes}
          extras={extras}
        />
      </div>
    </div>
  );
}
