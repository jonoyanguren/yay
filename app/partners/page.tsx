import type { Metadata } from "next";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import holaflyLogo from "@/assets/partners/holafly.png";
import mandukaLogo from "@/assets/partners/manduka.png";
import iatiLogo from "@/assets/partners/iati.png";
import yogaAllianceLogo from "@/assets/partners/yogaalliance.png";

type Partner = {
  name: string;
  category: string;
  description: string;
  logo: StaticImageData;
  affiliateUrl?: string;
  affiliateDiscount?: string;
};

const discountPartners: Partner[] = [
  {
    name: "Holafly",
    category: "Conectividad",
    description:
      "eSIM para viajar con internet desde que aterrizas. Menos fricción y más tranquilidad en cada retiro.",
    logo: holaflyLogo,
    affiliateDiscount: "Descuento activo",
  },
  {
    name: "Manduka",
    category: "Material de práctica",
    description:
      "Esterillas de alta calidad para una práctica estable, cómoda y duradera en cada sesión.",
    logo: mandukaLogo,
    affiliateDiscount: "Descuento activo",
  },
  {
    name: "IATI",
    category: "Seguros de viaje",
    description:
      "Seguro de viaje con asistencia para que puedas vivir la experiencia con más calma y respaldo.",
    logo: iatiLogo,
    affiliateUrl:
      "https://www.iatiseguros.com?r=29272939552707&utm_source=colaboradores&utm_medium=referral",
    affiliateDiscount: "5% de descuento",
  },
];

const certificationPartner: Partner = {
  name: "Yoga Alliance",
  category: "Certificación profesional",
  description:
    "Andrea está certificada por Yoga Alliance (RYT 200), una referencia internacional en estándares de formación para profesoras de yoga.",
  logo: yogaAllianceLogo,
};

const certificationBadge = "Certificación verificada";

export const metadata: Metadata = {
  title: "Partners | YaY experiences",
  description:
    "Conoce nuestros partners con descuento y la certificación profesional de Andrea en Yoga Alliance.",
  alternates: {
    canonical: "/partners",
  },
};

export default function PartnersPage() {
  return (
    <div className="px-4 md:px-12 py-24 max-w-6xl mx-auto">
      <section className="text-center mb-14 space-y-5">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Partners
        </h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
          Trabajamos con marcas que aportan valor real a la experiencia y con
          una base profesional sólida en la formación de Andrea.
        </p>
      </section>

      <section className="mb-14">
        <div className="mb-7">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Partners con descuento para la comunidad
          </h2>
          <p className="text-black/65 mt-2 max-w-3xl">
            Estos partners ofrecen ventajas para seguidores y clientes de YaY en
            servicios clave para viajar y practicar con más comodidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {discountPartners.map((partner) => (
            <article
              key={partner.name}
              className="bg-white rounded-2xl border border-black/10 p-7 md:p-8 hover:border-black/20 transition-colors"
            >
              <div className="h-10 mb-5 flex items-center">
                <Image
                  src={partner.logo}
                  alt={`Logo de ${partner.name}`}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <p className="text-xs uppercase tracking-wider text-black/50">
                  {partner.category}
                </p>
                {partner.affiliateDiscount && (
                  <span className="inline-flex items-center rounded-full bg-green/20 text-black text-xs font-semibold px-3 py-1">
                    {partner.affiliateDiscount}
                  </span>
                )}
              </div>
              <p className="text-black/70 leading-relaxed">{partner.description}</p>
              {partner.affiliateUrl && (
                <div className="mt-6">
                  <Link
                    href={partner.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-black/85 transition-colors"
                  >
                    Activar descuento IATI
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-7">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Certificación de Andrea
          </h2>
          <p className="text-black/65 mt-2 max-w-3xl">
            Más allá de las colaboraciones, la práctica está respaldada por una
            formación reconocida internacionalmente.
          </p>
        </div>

        <article className="bg-white rounded-2xl border border-black/10 p-7 md:p-8 hover:border-black/20 transition-colors">
          <div className="h-10 mb-5 flex items-center">
            <Image
              src={certificationPartner.logo}
              alt={`Logo de ${certificationPartner.name}`}
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-xs uppercase tracking-wider text-black/50">
              {certificationPartner.category}
            </p>
            <span className="inline-flex items-center rounded-full bg-brand-cream-cool text-black text-xs font-semibold px-3 py-1">
              {certificationBadge}
            </span>
          </div>
          <p className="text-black/70 leading-relaxed">
            {certificationPartner.description}
          </p>
        </article>
      </section>
    </div>
  );
}
