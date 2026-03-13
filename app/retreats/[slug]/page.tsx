import Image from "next/image";
import type { Metadata } from "next";
import Title from "@/components/ui/Title";
import ImageGallery from "@/components/ImageGallery";
import TrackMetaOnMount from "@/components/analytics/TrackMetaOnMount";
import AccommodationSection from "@/components/retreats/AccommodationSection";
import ArrivalOptionsSection, {
  type ArrivalOption,
} from "@/components/retreats/ArrivalOptionsSection";
import ExperienceSection from "@/components/retreats/ExperienceSection";
import FadeInOnView from "@/components/retreats/FadeInOnView";
import ItinerarySection from "@/components/retreats/ItinerarySection";
import RetreatHero from "@/components/retreats/RetreatHero";
import RetreatSection from "@/components/retreats/RetreatSection";
import ScrollToTopOnMount from "@/components/retreats/ScrollToTopOnMount";
import RetreatStickyInfoBar from "@/components/retreats/RetreatStickyInfoBar";
import WaitlistForm from "@/components/retreats/WaitlistForm";
import WaveSeparator from "@/components/retreats/WaveSeparator";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRetreatCapacity } from "@/lib/retreat-capacity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface DayItem {
  day: string;
  items: string[];
}

interface RetreatTextHighlights {
  fullDescription?: string[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function normalizeHighlights(value: unknown): RetreatTextHighlights {
  const empty: RetreatTextHighlights = {
    fullDescription: [],
  };

  if (!value) return empty;

  let parsed: unknown = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return empty;
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    return empty;
  const source = parsed as Record<string, unknown>;

  const asStringArray = (input: unknown) =>
    Array.isArray(input)
      ? input.filter((item): item is string => typeof item === "string")
      : [];

  return {
    fullDescription: asStringArray(source.fullDescription),
  };
}

export const dynamic = "force-dynamic";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);

  if (!retreat) {
    return {
      title: "Retiro no encontrado",
      description: "El retiro solicitado no está disponible en este momento.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = `/retreats/${retreat.slug}`;
  const imageUrl = retreat.images?.[0] || retreat.image || "/assets/placeholder.jpg";
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${siteUrl}${imageUrl}`;
  const title = `${retreat.title} | Retiro bienestar y retiro yoga`;
  const description =
    retreat.description ||
    `Conoce ${retreat.title}, un retiro bienestar y retiro yoga en ${retreat.location}.`;

  return {
    title,
    description,
    keywords: [
      "retiros bienestar",
      "retiros yoga",
      `retiro ${retreat.location.toLowerCase()}`,
      retreat.title.toLowerCase(),
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "article",
      images: [{ url: fullImageUrl, alt: retreat.title }],
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
  };
}

export default async function RetreatPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);
  const bgColor = retreat?.bgColor?.trim() || "#d77a61";

  if (!retreat) {
    notFound();
  }

  const { maxPeople, spotsLeft, isSoldOut } = await getRetreatCapacity(
    retreat.id,
  );

  const arrivalOptions = (Array.isArray(retreat.arrivalOptions)
    ? retreat.arrivalOptions
    : []) as unknown as ArrivalOption[];
  const arrivalIntro =
    retreat.arrivalIntro ??
    "Llega como quieras: te ayudamos a coordinar vuelos, coche o transfer para que encaje con el grupo y con tus horarios.";

  const dayByDay = (Array.isArray(retreat.dayByDay)
    ? retreat.dayByDay
    : []) as unknown as DayItem[];
  const hotelName = retreat.hotelName?.trim() || "";
  const hotelUrl = retreat.hotelUrl?.trim() || "";
  const videoUrl = retreat.videoUrl?.trim() || "";
  const accommodationTitle =
    retreat.accommodationTitle?.trim() || "Accommodation";
  const accommodationDescription =
    retreat.accommodationDescription?.trim() || "";
  const accommodationImages = retreat.accommodationImages || [];
  const hasAccommodationContent =
    Boolean(accommodationDescription) || accommodationImages.length > 0;
  const hasColoredSections =
    hasAccommodationContent || arrivalOptions.length > 0;
  const includes = (
    Array.isArray(retreat.includes) ? retreat.includes : []
  ) as string[];
  const notIncludes = (
    Array.isArray(retreat.notIncludes) ? retreat.notIncludes : []
  ) as string[];
  const activitiesImageRaw = retreat.activitiesImage?.trim() || "";
  const activitiesImage =
    activitiesImageRaw && !activitiesImageRaw.startsWith("/assets/")
      ? activitiesImageRaw
      : retreat.images?.[0] || retreat.image || "";
  const imageUrl =
    retreat.images?.[0] || retreat.image || "/assets/placeholder.jpg";
  const galleryImages = retreat.images || [];
  const textHighlights = normalizeHighlights(retreat.textHighlights);
  const retreatUrl = `${siteUrl}/retreats/${retreat.slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: retreat.title,
    description: retreat.description,
    image: galleryImages.length > 0 ? galleryImages : [imageUrl],
    category: "Retiros bienestar y yoga",
    brand: {
      "@type": "Brand",
      name: "YaY experiences",
    },
    offers: {
      "@type": "Offer",
      url: retreatUrl,
      priceCurrency: "EUR",
      availability:
        spotsLeft > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
  };

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ScrollToTopOnMount />
      <TrackMetaOnMount
        eventName="ViewContent"
        params={{
          content_ids: [retreat.id],
          content_name: retreat.title,
          content_type: "product",
        }}
      />
      <section>
        <RetreatHero
          title={retreat.title}
          location={retreat.location}
          date={retreat.date}
          imageUrl={imageUrl}
        />
      </section>

      <div className="hidden md:block">
        <FadeInOnView>
          {isSoldOut ? (
            <WaitlistForm retreatSlug={retreat.slug} />
          ) : (
            <RetreatStickyInfoBar
              date={retreat.date}
              location={retreat.location}
              maxPeople={maxPeople}
              spotsLeft={spotsLeft}
              bookingHref={`/retreats/${retreat.slug}/book`}
            />
          )}
        </FadeInOnView>
      </div>

      <div className="md:hidden px-4 pt-4">
        {isSoldOut ? (
          <WaitlistForm retreatSlug={retreat.slug} />
        ) : (
          <RetreatStickyInfoBar
            date={retreat.date}
            location={retreat.location}
            maxPeople={maxPeople}
            spotsLeft={spotsLeft}
            bookingHref={`/retreats/${retreat.slug}/book`}
            disableSticky
          />
        )}
      </div>

      <RetreatSection>
        <ExperienceSection
          title="La experiencia"
          description={retreat.fullDescription}
          descriptionHighlights={textHighlights.fullDescription || []}
          highlightColor={bgColor}
          imageSrc={retreat.images?.[1] || imageUrl}
          imageAlt={`${retreat.title} experience`}
        />
      </RetreatSection>

      {/* <RetreatSection type="full">
        <InspirationalScrollHighlight />
      </RetreatSection> */}

      {/* Galería de imágenes - ancho completo */}
      {galleryImages.length > 0 && (
        <section className="py-6 md:py-12 px-0 overflow-x-clip">
          <ImageGallery
            images={galleryImages}
            altPrefix={retreat.title}
            variant="stack-parallax"
            className="w-full"
          />
        </section>
      )}

      {/* Itinerary section */}
      <RetreatSection>
        <ItinerarySection title="Itinerario día a día" days={dayByDay} />
      </RetreatSection>

      {activitiesImage && (
        <RetreatSection>
          <Image
            src={activitiesImage}
            width={1080}
            height={800}
            alt={`Collage de actividades de ${retreat.title}`}
            className="rounded-xl md:rounded-none"
          />
        </RetreatSection>
      )}

      {hasColoredSections && (
        <div className="overflow-hidden">
          <WaveSeparator
            variant="bold"
            bgColor={bgColor}
            heightClassName="h-16 md:h-28"
          />

          {/* Accommodation section */}
          {hasAccommodationContent && (
            <RetreatSection
              className="text-center"
              style={{ backgroundColor: bgColor }}
              animate={false}
            >
              <AccommodationSection
                title={accommodationTitle}
                description={accommodationDescription}
                images={accommodationImages}
                hotelName={hotelName}
                hotelUrl={hotelUrl}
                videoUrl={videoUrl}
              />
            </RetreatSection>
          )}

          {arrivalOptions.length > 0 && (
            <RetreatSection
              className="text-center"
              style={{ backgroundColor: bgColor }}
              type="full"
              animate={false}
            >
              <ArrivalOptionsSection
                intro={arrivalIntro}
                options={arrivalOptions}
              />
            </RetreatSection>
          )}

          <WaveSeparator
            variant="bold"
            flip
            bgColor={bgColor}
            heightClassName="h-16 md:h-28"
          />
        </div>
      )}

      {(includes.length > 0 || notIncludes.length > 0) && (
        <RetreatSection>
          <section className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-gray/15 rounded-lg bg-white space-y-2">
              <Title className="text-xl">Qué incluye</Title>
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
              <Title className="text-xl">No incluye</Title>
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
        </RetreatSection>
      )}

      <div className="md:hidden px-4 mt-6">
        {isSoldOut ? (
          <WaitlistForm retreatSlug={retreat.slug} />
        ) : (
          <RetreatStickyInfoBar
            date={retreat.date}
            location={retreat.location}
            maxPeople={maxPeople}
            spotsLeft={spotsLeft}
            bookingHref={`/retreats/${retreat.slug}/book`}
            disableSticky
          />
        )}
      </div>
    </div>
  );
}
