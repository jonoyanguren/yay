import Button from "@/components/ui/Button";
import RetreatCard from "@/components/RetreatCard";
import HeroTextLoop from "@/components/HeroTextLoop";
import Image from "next/image";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

async function getRetreats() {
  try {
    const retreats = await prisma.retreat.findMany({
      where: { published: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        location: true,
        description: true,
        fullDescription: true,
        activities: true,
        program: true,
        image: true,
        images: true,
        date: true,
        price: true,
        maxPeople: true,
        arrivalIntro: true,
        arrivalOptions: true,
        dayByDay: true,
        includes: true,
        notIncludes: true,
        extraIdeas: true,
        published: true,
        createdAt: true,
      },
    });
    const paidCounts = await prisma.booking.groupBy({
      by: ["retreatId"],
      where: { status: "paid" },
      _count: true,
    });
    const countByRetreat = Object.fromEntries(
      paidCounts.map((c) => [c.retreatId, c._count])
    );
    return retreats.map((r) => ({
      ...r,
      spotsLeft: Math.max(0, (r.maxPeople ?? 12) - (countByRetreat[r.id] ?? 0)),
    }));
  } catch (error) {
    console.error("Error fetching retreats:", error);
    return [];
  }
}

export const revalidate = 60;

export default async function Home() {
  const retreats = await getRetreats();
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center px-4 bg-black text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="absolute inset-0 bg-[url('/assets/me.jpg')] bg-cover bg-center"></div>
        </video>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            Desconecta{" "}
            <HeroTextLoop
              words={[
                "del ruido.",
                "del estrés.",
                "del agobio.",
                "de la prisa.",
              ]}
            />
            <br /> Conecta contigo mismo.
          </h1>
          <p className="text-xl md:text-2xl text-gray max-w-2xl mx-auto leading-relaxed">
            Retiros modernos enfocados en bienestar práctico, movimiento y
            experiencias de calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" href="#retreats">
              Ver Retiros
            </Button>
            <Button
              size="lg"
              variant="outline"
              href="/concept"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Nuestro Concepto
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy / Approach Section */}
      <section className="px-4 md:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Sin mantras. Solo descanso.
          </h2>
          <p className="text-lg text-black/70 leading-relaxed">
            Creemos en el bienestar tangible. Nuestros retiros están diseñados
            para personas estresadas que buscan relajación física, buena comida
            y desconexión digital, sin la estética espiritual clásica.
          </p>
          <ul className="space-y-4 pt-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <span>Movilidad y estiramientos funcionales</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <span>Experiencias sensoriales y gastronómicas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <span>Entornos de diseño minimalista</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray/20 aspect-square md:aspect-4/5 rounded-lg overflow-hidden relative">
          <Image
            src="/assets/me2.jpg"
            alt="Filosofía de descanso"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Retreats Grid */}
      <section id="retreats" className="px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Próximos Retiros
            </h2>
            <p className="text-black/60">Elige tu destino de desconexión.</p>
          </div>
          <Button variant="ghost" className="hidden md:inline-flex">
            Ver todos &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {retreats.map((retreat: any) => (
            <RetreatCard key={retreat.id} retreat={retreat} />
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section className="bg-black text-white py-24 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Experiencias Reales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-white/20 pb-2">
                Cata de Café
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                Descubre matices y aromas con expertas de nivel internacional.
                Una experiencia para despertar los sentidos.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-white/20 pb-2">
                Vinos Naturales
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                Degustación de vinos sin sulfitos añadidos, conectando con la
                tierra y el proceso natural de fermentación.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-white/20 pb-2">
                Música en Vivo
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                Conciertos íntimos de swing y rock acústico. Música real para
                gente real, sin grabaciones.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-white/20 pb-2">
                Cocina Colaborativa
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                Aprende, cocina y comparte. La cena sabe mejor cuando se prepara
                en comunidad con ingredientes locales.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-white/20 pb-2">
                Productividad Consciente
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                Charlas prácticas sobre cómo gestionar el tiempo y la atención
                en un mundo hiperconectado.
              </p>
            </div>

            <div className="space-y-4 flex flex-col justify-center">
              <p className="text-2xl font-serif italic text-white/80">
                &quot;Actividades diseñadas para volver al mundo físico.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-12 max-w-3xl mx-auto w-full text-center space-y-8">
        <h2 className="text-3xl font-bold">Recupera tu tiempo y tu atención</h2>
        <p className="text-black/70">
          Únete a nuestra comunidad. Compartimos retiros exclusivos y
          estrategias para mantener el equilibrio en un mundo hiperconectado.
          Cero spam, 100% realidad.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 pb-6">
          <Button
            href="https://www.instagram.com/yay.experiences"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-linear-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] text-white border-none hover:opacity-90 hover:text-white gap-2 bg-transparent!"
          >
            <FaInstagram className="text-xl" />
            Instagram
          </Button>
          <Button
            href="https://chat.whatsapp.com/B70aKrnocWsIaka1TVc22e"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366]! text-white border-none hover:bg-[#128C7E]! hover:text-white gap-2"
          >
            <FaWhatsapp className="text-xl" />
            Comunidad WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}
