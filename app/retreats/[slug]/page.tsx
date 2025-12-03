import { retreats } from "@/lib/data";
import Button from "@/components/ui/Button";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return retreats.map((retreat) => ({
    slug: retreat.slug,
  }));
}

export default async function RetreatPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = retreats.find((r) => r.slug === slug);

  if (!retreat) {
    notFound();
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="h-[60vh] bg-gray/20 relative flex items-end pb-12 px-4 md:px-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Link
            href="/#retreats"
            className="text-white/80 hover:text-white text-sm mb-4 block"
          >
            &larr; Volver a Retiros
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            {retreat.title}
          </h1>
          <p className="text-xl text-white/90 flex items-center gap-2">
            <span>{retreat.location}</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>{retreat.date}</span>
          </p>
        </div>
      </div>

      <div className="px-4 md:px-12 max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-12 md:gap-24">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">La Experiencia</h2>
            <p className="text-lg leading-relaxed text-black/80 whitespace-pre-line">
              {retreat.fullDescription}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Actividades Destacadas</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {retreat.activities.map((activity, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-4 bg-sand-light border border-gray/10 rounded-lg"
                >
                  <span className="text-green font-bold">0{index + 1}</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Programa</h2>
            <div className="space-y-4 border-l-2 border-gray/20 pl-6 ml-2">
              {retreat.program.map((item, index) => (
                <div key={index} className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-black border-4 border-sand"></span>
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Booking */}
        <div className="md:col-span-1">
          <div className="sticky top-24 p-6 bg-sand-light border border-gray/20 rounded-xl shadow-sm space-y-6">
            <div>
              <span className="text-sm text-gray-dark uppercase tracking-wide">
                Precio por persona
              </span>
              <div className="text-3xl font-bold mt-1">{retreat.price}</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Fechas</span>
                <span className="font-medium">{retreat.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Ubicación</span>
                <span className="font-medium text-right">
                  {retreat.location}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray/10">
                <span className="text-black/60">Grupo</span>
                <span className="font-medium">Max 12 personas</span>
              </div>
            </div>

            <Button className="w-full" size="lg" href="/contact">
              Solicitar Plaza
            </Button>
            <p className="text-xs text-center text-black/40">
              Sin compromiso. Te contactaremos para confirmar disponibilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
