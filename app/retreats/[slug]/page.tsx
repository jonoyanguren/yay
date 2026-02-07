import Button from "@/components/ui/Button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ArrivalOption {
  title: string;
  detail: string;
}

interface DayItem {
  day: string;
  items: string[];
}

export async function generateStaticParams() {
  const retreats = await prisma.retreat.findMany({
    where: { published: true },
    select: { slug: true },
  });
  
  return retreats.map((retreat) => ({
    slug: retreat.slug,
  }));
}

async function getRetreatBySlug(slug: string) {
  return await prisma.retreat.findUnique({
    where: { 
      slug,
      published: true,
    },
  });
}

export default async function RetreatPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);

  if (!retreat) {
    notFound();
  }

  const arrivalOptions = (Array.isArray(retreat.arrivalOptions) ? retreat.arrivalOptions : []) as unknown as ArrivalOption[];
  const arrivalIntro =
    retreat.arrivalIntro ??
    "Llega como quieras: te ayudamos a coordinar vuelos, coche o transfer para que encaje con el grupo y con tus horarios.";

  const dayByDay = (Array.isArray(retreat.dayByDay) ? retreat.dayByDay : []) as unknown as DayItem[];
  const includes = (Array.isArray(retreat.includes) ? retreat.includes : []) as string[];
  const notIncludes = (Array.isArray(retreat.notIncludes) ? retreat.notIncludes : []) as string[];
  const extraIdeas = (Array.isArray(retreat.extraIdeas) ? retreat.extraIdeas : []) as string[];
  const activities = (Array.isArray(retreat.activities) ? retreat.activities : []) as string[];
  const program = (Array.isArray(retreat.program) ? retreat.program : []) as string[];

  return (
    <div className="pb-24">
      {/* Hero */}
      <div
        className="h-[60vh] bg-gray/20 relative flex items-end pb-12 px-4 md:px-12"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${retreat.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
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

          {arrivalOptions.length > 0 && (
            <>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Llegadas y transfers</h2>
                  <span className="text-xs uppercase tracking-wide text-black/50">
                    Opcional
                  </span>
                </div>
                <p className="text-black/70 text-sm leading-relaxed">
                  {arrivalIntro}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {arrivalOptions.map((item) => (
                    <div
                      key={item.title}
                      className="p-4 border border-gray/15 rounded-lg bg-white shadow-sm"
                    >
                      <p className="text-sm font-semibold mb-2">{item.title}</p>
                      <p className="text-sm leading-relaxed text-black/80">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {dayByDay.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold">Itinerario día a día</h2>
                  <div className="relative pl-8 md:pl-10">
                    <div className="absolute left-3 md:left-4 top-2 bottom-2 w-px bg-gray/15" />
                    <div className="space-y-5">
                      {dayByDay.map((day) => (
                        <div key={day.day} className="relative">
                          <span className="absolute -left-[9px] md:-left-[7px] top-3 w-4 h-4 rounded-full bg-black border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.08)]" />
                          <div className="ml-4 md:ml-6 p-5 md:p-6 bg-white border border-gray/10 rounded-xl shadow-sm">
                            <p className="text-sm uppercase tracking-wide text-black/50 mb-2">
                              {day.day}
                            </p>
                            <ul className="space-y-2 text-black/80">
                              {day.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="text-green font-bold">
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6">Actividades Destacadas</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {activities.map((activity, index) => (
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
              {program.map((item, index) => (
                <div key={index} className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-black border-4 border-sand"></span>
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {(includes.length > 0 || notIncludes.length > 0) && (
            <section className="grid md:grid-cols-2 gap-6">
              <div className="p-5 border border-gray/15 rounded-lg bg-white space-y-2">
                <h3 className="text-xl font-semibold">Qué incluye</h3>
                <ul className="space-y-2 text-black/80">
                  {includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-green font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 border border-gray/15 rounded-lg bg-white space-y-2">
                <h3 className="text-xl font-semibold">No incluye</h3>
                <ul className="space-y-2 text-black/80">
                  {notIncludes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-black/40 font-bold">–</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {extraIdeas.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-2xl font-bold">Otras ideas de tarde/noche</h2>
              <div className="flex flex-wrap gap-3">
                {extraIdeas.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-2 bg-sand-light border border-gray/10 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar / Booking */}
        <div className="md:col-span-1">
          <div className="sticky top-24 p-6 bg-sand-light border border-gray/20 rounded-xl shadow-sm space-y-6">
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

            <Button
              className="w-full"
              size="lg"
              href={`/retreats/${retreat.slug}/book`}
            >
              Reservar plaza
            </Button>
            <p className="text-xs text-center text-black/40">
              Elige habitación y extras; pago seguro con Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
