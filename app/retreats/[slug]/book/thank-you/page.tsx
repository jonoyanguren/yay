import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

async function getRetreatBySlug(slug: string) {
  try {
    const retreat = await prisma.retreat.findUnique({
      where: { 
        slug,
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });
    return retreat;
  } catch (error) {
    console.error("Error fetching retreat:", error);
    return null;
  }
}

export default async function ThankYouPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { session_id } = await searchParams;
  const retreat = await getRetreatBySlug(slug);

  return (
    <div className="px-4 md:px-12 max-w-xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Reserva recibida</h1>
      <p className="text-black/70 mb-8">
        Gracias por reservar. Si el pago se ha completado correctamente, te
        hemos enviado un email de confirmación.
      </p>
      {session_id && (
        <p className="text-xs text-black/50 mb-6">
          Referencia: {session_id.slice(0, 20)}…
        </p>
      )}
      <Link
        href={retreat ? `/retreats/${slug}` : "/"}
        className="inline-flex items-center justify-center rounded-full font-medium bg-black text-white hover:bg-gray-dark h-11 px-8 text-sm"
      >
        {retreat ? `Volver a ${retreat.title}` : "Ir al inicio"}
      </Link>
    </div>
  );
}
