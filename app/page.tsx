import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import RetreatCard from "@/components/RetreatCard";
import HeroTextLoop from "@/components/HeroTextLoop";
import Image from "next/image";
import {
  FaInstagram,
  FaWhatsapp,
  FaWineGlass,
  FaRegSmile,
} from "react-icons/fa";
import { BiCoffee, BiMusic, BiCookie, BiTime } from "react-icons/bi";
import { prisma } from "@/lib/prisma";
import { getRetreatSpotsLeftMap } from "@/lib/retreat-capacity";
import holaflyLogo from "@/assets/partners/holafly.png";
import mandukaLogo from "@/assets/partners/manduka.png";
import iatiLogo from "@/assets/partners/iati.png";
import yogaAllianceLogo from "@/assets/partners/yogaalliance.png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Retiros bienestar y retiros yoga en grupo",
  description:
    "Descubre retiros bienestar y retiros yoga diseñados para desconectar, descansar y recuperar energía con experiencias reales.",
  keywords: [
    "retiros bienestar",
    "retiros yoga",
    "retiros para desconectar",
    "retiro de bienestar en grupo",
  ],
  alternates: {
    canonical: "/",
  },
};

async function getRetreats() {
  try {
    const retreats = await prisma.retreat.findMany({
      orderBy: [{ published: "desc" }, { createdAt: "asc" }],
      where: { hideFromWeb: false },
      select: {
        id: true,
        slug: true,
        title: true,
        date: true,
        location: true,
        description: true,
        image: true,
        images: true,
        published: true,
        createdAt: true,
      },
    });
    const spotsLeftByRetreat = await getRetreatSpotsLeftMap(
      retreats.map((retreat) => retreat.id),
    );

    return retreats.map((r) => ({
      ...r,
      spotsLeft: spotsLeftByRetreat.get(r.id) ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching retreats:", error);
    return [];
  }
}

export const revalidate = 60;

export default async function Home() {
  const retreats = await getRetreats();
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "YaY experiences",
    description:
      "Retiros bienestar y retiros yoga con enfoque práctico para desconectar del estrés digital.",
    url: siteUrl,
    areaServed: "ES",
    sameAs: ["https://www.instagram.com/yay.experiences"],
  };

  return (
    <div className="flex flex-col gap-24 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
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
          <h1 className="text-5xl md:text-7xl font-medium">
            Desconecta{" "}
            <HeroTextLoop
              words={[
                "del ruido.",
                "del estrés.",
                "del agobio.",
                "de la prisa.",
              ]}
            />
          </h1>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tighter">
            Conecta contigo mismo.
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed">
            Retiros modernos enfocados en bienestar práctico, movimiento y
            experiencias de calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              href="#retreats"
              className="bg-brand-accent-yellow! text-brand-main-dark! border border-brand-accent-yellow! hover:bg-[#ffdb66]! hover:text-brand-main-dark!"
            >
              Ver Retiros
            </Button>
            <Button
              size="lg"
              variant="outline"
              href="/about"
              className="text-white! border-white! hover:bg-white! hover:border-white! hover:text-brand-main-dark!"
            >
              Sobre Nosotros
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
          <div className="flex flex-col items-center gap-3 pt-6 px-8 md:flex-row md:items-center md:gap-3 md:px-0">
            <Image
              src="/assets/RYT200.png"
              alt="Certificación RYT 200 - Registered Yoga Teacher"
              width={120}
              height={120}
              className="w-28 h-28 md:w-14 md:h-14 shrink-0"
            />
            <p className="text-sm text-black/60 leading-snug text-center md:text-left">
              Andrea es profesora certificada{" "}
              <strong className="text-black/80">RYT 200</strong> por Yoga
              Alliance
            </p>
          </div>
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
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.id} retreat={retreat} />
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl border border-black/10 bg-white px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Partners
              </h2>
              <p className="text-black/65 mt-2">
                Marcas y certificaciones que respaldan nuestra experiencia.
              </p>
            </div>
            <Button href="/partners" variant="outline" className="w-fit">
              Ver todos los partners
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center">
            {[
              { src: holaflyLogo, alt: "Logo Holafly" },
              { src: mandukaLogo, alt: "Logo Manduka" },
              { src: iatiLogo, alt: "Logo IATI Seguros" },
              { src: yogaAllianceLogo, alt: "Logo Yoga Alliance" },
            ].map((partner) => (
              <div
                key={partner.alt}
                className="h-10 md:h-12 flex items-center justify-center"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concept Hero */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-black px-4 md:px-12">
        <div className="relative z-10 container mx-auto text-center text-white max-w-4xl py-24">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
            Nuestro concepto
          </h2>
          <p className="text-2xl md:text-3xl font-medium text-green mb-8">
            Si no es YAY, no es.
          </p>
          <p className="text-xl md:text-2xl font-medium mb-8 text-white/90">
            Desconectar haciendo cosas que te hacen feliz.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto text-white/80">
            No somos un retiro de incienso y mantras eternos. Somos retiros para
            personas reales: algo de yoga, buena comida, una copa de vino,
            conversaciones honestas y tiempo sin pantallas para recargar de
            verdad.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              "Yoga fácil, para relajar cuerpo y mente",
              "Actividades que disfrutas",
              "Buena comida y vino",
              "Cero postureo",
            ].map((item, idx) => (
              <span
                key={idx}
                className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mucho más que yoga */}
      <section className="px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Mucho más que yoga
          </h2>
          <p className="text-lg md:text-xl text-black/70">
            Creamos grupos para desconectar juntos. El yoga es solo el
            principio: diseñamos actividades para que conectes con otras
            personas, te diviertas y compartas experiencias reales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BiCoffee className="w-6 h-6" />,
              title: "Cata de café",
              desc: "Con expertos baristas",
            },
            {
              icon: <FaWineGlass className="w-6 h-6" />,
              title: "Vinos naturales",
              desc: "En buena compañía",
            },
            {
              icon: <BiMusic className="w-6 h-6" />,
              title: "Concierto íntimo",
              desc: "Swing y rock en directo",
            },
            {
              icon: <BiCookie className="w-6 h-6" />,
              title: "Cocina con nosotros",
              desc: "Cocinamos y comemos juntos",
            },
            {
              icon: <BiTime className="w-6 h-6" />,
              title: "Charlas slow",
              desc: "Productividad para vivir tranquilo",
            },
            {
              icon: <FaRegSmile className="w-6 h-6" />,
              title: "Risas aseguradas",
              desc: "Sin guiones ni etiquetas",
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 border border-black/5 rounded-xl hover:border-black/20 hover:bg-sand-light transition-colors group"
            >
              <div className="p-3 bg-sand-light rounded-full group-hover:bg-white transition-colors text-black">
                {activity.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{activity.title}</h3>
                <p className="text-black/60 text-sm">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCK 4: Para personas reales */}
      <section className="py-20 bg-green text-brand-main-dark px-4 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Para personas reales, con vidas reales
          </h2>
          <p className="text-lg md:text-xl text-brand-main-dark/90 mb-12 leading-relaxed">
            Da igual si nunca has pisado una esterilla de yoga o si trabajas 10
            horas al día frente a un ordenador. Diseñamos retiros para gente
            normal que necesita parar, respirar y volver a casa con la sensación
            de &quot;por fin he descansado de verdad&quot;.
          </p>
          <div className="inline-block border-2 border-brand-main-dark/30 px-8 py-4 rounded-full text-xl font-bold tracking-wide bg-white/10 backdrop-blur-sm rotate-1 hover:rotate-0 transition-transform">
            Sin dogmas. Sin dramas. Sin disfraces espirituales.
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
