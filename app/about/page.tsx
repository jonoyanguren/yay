import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre YaY experiences",
  description:
    "Descubre la filosofía de YaY experiences: retiros bienestar y retiros yoga para descansar mejor, moverte y reconectar sin misticismo.",
  keywords: [
    "sobre yay experiences",
    "retiros bienestar",
    "retiros yoga",
    "filosofia de bienestar",
  ],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-4 md:px-12 pt-28 pb-16 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
          Sobre Nosotros
        </h1>
        <p className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed">
          Cómo pasamos de practicar yoga en casa a montar una empresa de retiros
          por el mundo.
        </p>
      </section>

      {/* Sobre Andrea */}
      <section className="px-4 md:px-12 py-20 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="bg-black/5 aspect-3/4 rounded-2xl overflow-hidden relative order-2 md:order-1">
            <Image
              src="/assets/about.jpg"
              alt="Andrea — instructora de yoga certificada RYT 200"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Sobre Andrea
            </h2>
            <p className="text-lg leading-relaxed text-black/70">
              Andrea es la instructora y alma creativa detrás de cada retiro
              YaY. Con su certificación{" "}
              <strong className="text-black">RYT 200</strong> por Yoga Alliance,
              lleva años formándose en un yoga que no necesita incienso ni
              mantras para funcionar.
            </p>
            <p className="text-lg leading-relaxed text-black/70">
              Su enfoque es <strong className="text-black">práctico</strong>,{" "}
              <strong className="text-black">minimalista</strong> y{" "}
              <strong className="text-black">eficaz</strong>: clases diseñadas
              para que tu cuerpo se mueva mejor, duermas mejor y vivas con menos
              tensión. Sin posturas imposibles ni discursos esotéricos.
            </p>
            <p className="text-lg leading-relaxed text-black/70">
              Para ella, el yoga es una herramienta. Y como toda buena
              herramienta, lo que importa es que funcione.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <Image
                src="/assets/RYT200.png"
                alt="Certificación RYT 200 - Registered Yoga Teacher"
                width={56}
                height={56}
                className="w-14 h-14 shrink-0"
              />
              <p className="text-sm text-black/50 leading-snug">
                Profesora certificada{" "}
                <strong className="text-black/70">RYT 200</strong> por Yoga
                Alliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre YaY — La Historia */}
      <section className="bg-brand-cream-cool py-20 md:py-28">
        <div className="px-4 md:px-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            Cómo nació YaY
          </h2>

          <div className="space-y-8 text-lg md:text-xl leading-relaxed text-black/70">
            <p>
              Todo empezó con Andrea practicando yoga en el salón de casa. No
              buscaba espiritualidad ni misticismo:{" "}
              <strong className="text-black">
                simplemente se sentía mejor después de cada sesión
              </strong>
              . Más ligera, más tranquila, más presente. Eso le bastó para
              seguir profundizando hasta sacarse la certificación de
              instructora. Poco a poco empezó a dar clases a amigos y conocidos,
              primero en persona y luego online, y siempre pasaba lo mismo: la
              gente llegaba escéptica y se iba preguntando cuándo repetían.
            </p>

            <blockquote className="border-l-4 border-brand-main pl-6 py-2 text-xl md:text-2xl italic text-black/80">
              Todo el mundo vive con estrés constante, problemas de sueño y
              burnouts. Había que hacer algo.
            </blockquote>

            <p>
              Como nómadas digitales, Andrea y Jon llevaban años viajando y
              descubriendo lugares increíbles. Un día juntaron sus dos pasiones
              — el yoga práctico y los viajes con sentido —{" "}
              <strong className="text-black">y nació YaY.</strong> Nada de
              incienso ni de abrazar árboles. Un concepto sencillo: cuidar el
              cuerpo, conocer sitios con alma y compartirlo en buena compañía.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="px-4 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            Nuestros Valores
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-5">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src="/assets/cercania.jpg"
                  alt="Cercanía — trato cercano y grupos pequeños"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">Cercanía</h3>
              <p className="text-black/60 leading-relaxed">
                Grupos pequeños, trato real y cero distancias. Aquí no hay
                gurús: somos personas normales que quieren compartir algo bueno
                contigo.
              </p>
            </div>

            <div className="space-y-5">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src="/assets/curiosity.jpg"
                  alt="Curiosidad — descubrir lugares nuevos"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">Curiosidad</h3>
              <p className="text-black/60 leading-relaxed">
                Cada retiro es una excusa para descubrir algo nuevo. Un lugar,
                un sabor, una forma de moverte. Creemos que viajar con los ojos
                abiertos cambia la perspectiva.
              </p>
            </div>

            <div className="space-y-5">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src="/assets/pasion.jpg"
                  alt="Pasión — energía en cada detalle"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">Pasión</h3>
              <p className="text-black/60 leading-relaxed">
                YaY nació de lo que nos apasiona: movernos, viajar y crear
                experiencias que importen. Esa energía está en cada detalle de
                cada retiro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
