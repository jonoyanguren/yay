import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

type RoomTypeWithSold = {
  id: string;
  retreat_id: string;
  name: string;
  description: string | null;
  images: string[];
  price_cents: number;
  max_quantity: number;
  sold: number | string;
};

function toNumber(v: number | string): number {
  return typeof v === "number" ? v : parseInt(String(v), 10) || 0;
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

async function getRoomTypesWithAvailability(retreatId: string) {
  try {
    const rows = await prisma.$queryRaw<RoomTypeWithSold[]>`
      SELECT r.id, r.retreat_id, r.name, r.description, r.images, r.price_cents, r.max_quantity,
             COALESCE(SUM(brs.quantity) FILTER (WHERE b.status = 'paid'), 0)::int AS sold
      FROM retreat_room_types r
      LEFT JOIN booking_room_slots brs ON brs.retreat_room_type_id = r.id
      LEFT JOIN bookings b ON b.id = brs.booking_id
      WHERE r.retreat_id = ${retreatId}
      GROUP BY r.id, r.retreat_id, r.name, r.description, r.images, r.price_cents, r.max_quantity
      ORDER BY r.price_cents ASC
    `;

    return rows.map((row: RoomTypeWithSold) => ({
      id: row.id,
      retreat_id: row.retreat_id,
      name: row.name,
      description: row.description ?? undefined,
      images: row.images || [],
      price_cents: row.price_cents,
      max_quantity: row.max_quantity,
      available: Math.max(0, row.max_quantity - toNumber(row.sold)),
    }));
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
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

  if (!retreat) {
    notFound();
  }

  const [roomTypes, extras] = await Promise.all([
    getRoomTypesWithAvailability(retreat.id),
    getExtraActivities(retreat.id),
  ]);

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
          roomTypes={roomTypes}
          extras={extras}
        />
      </div>
    </div>
  );
}
