import Button from "@/components/ui/Button";
import RetreatCard from "@/components/RetreatCard";
import { retreats } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center px-4 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            Desconecta del ruido.
            <br /> Conecta con la realidad.
          </h1>
          <p className="text-xl md:text-2xl text-gray max-w-2xl mx-auto leading-relaxed">
            Retiros modernos enfocados en bienestar práctico, movimiento y
            experiencias de calidad. Sin misticismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" href="#retreats">
              Ver Retiros
            </Button>
            <Button
              size="lg"
              variant="outline"
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
        <div className="bg-gray/20 aspect-square md:aspect-[4/5] rounded-lg">
          {/* Image Placeholder */}
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
          {retreats.map((retreat) => (
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
                "Actividades diseñadas para volver al mundo físico."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-4 md:px-12 max-w-3xl mx-auto w-full text-center space-y-8">
        <h2 className="text-3xl font-bold">Únete al club de la desconexión</h2>
        <p className="text-black/70">
          Recibe avisos de nuevos retiros y consejos de bienestar práctico. Sin
          spam, solo calidad.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="tu@email.com"
            className="flex-1 bg-transparent border-b border-black px-4 py-2 outline-none focus:border-gray transition-colors"
          />
          <Button>Suscribirse</Button>
        </form>
      </section>
    </div>
  );
}
