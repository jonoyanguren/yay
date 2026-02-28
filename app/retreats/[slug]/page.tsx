import Image from "next/image";
import Title from "@/components/ui/Title";
import ImageGallery from "@/components/ImageGallery";
import TrackMetaOnMount from "@/components/analytics/TrackMetaOnMount";
import AccommodationSection from "@/components/retreats/AccommodationSection";
import ExperienceSection from "@/components/retreats/ExperienceSection";
import FadeInOnView from "@/components/retreats/FadeInOnView";
import ItinerarySection from "@/components/retreats/ItinerarySection";
import InspirationalScrollHighlight from "@/components/retreats/InspirationalScrollHighlight";
import RetreatHero from "@/components/retreats/RetreatHero";
import RetreatSection from "@/components/retreats/RetreatSection";
import RetreatStickyInfoBar from "@/components/retreats/RetreatStickyInfoBar";
import WaveSeparator from "@/components/retreats/WaveSeparator";
import { notFound } from "next/navigation";
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

export default async function RetreatPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);

  if (!retreat) {
    notFound();
  }

  const paidCount = await prisma.booking.count({
    where: { retreatId: retreat.id, status: { in: ["deposit", "paid"] } },
  });
  const maxPeople = retreat.maxPeople ?? 12;
  const spotsLeft = Math.max(0, maxPeople - paidCount);

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
  const hasDarkBlueSections =
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

  console.log("Activities image:", activitiesImage);

  return (
    <div className="pb-24">
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

      <FadeInOnView>
        <RetreatStickyInfoBar
          date={retreat.date}
          location={retreat.location}
          maxPeople={maxPeople}
          spotsLeft={spotsLeft}
          bookingHref={`/retreats/${retreat.slug}/book`}
        />
      </FadeInOnView>

      <RetreatSection>
        <ExperienceSection
          title="La experiencia"
          description={retreat.fullDescription}
          imageSrc={retreat.images?.[1] || imageUrl}
          imageAlt={`${retreat.title} experience`}
        />
      </RetreatSection>

      <RetreatSection type="full">
        <InspirationalScrollHighlight />
      </RetreatSection>

      {/* Galería de imágenes - ancho completo */}
      {galleryImages.length > 0 && (
        <section className="py-6 md:py-12">
          <ImageGallery
            images={galleryImages}
            altPrefix={retreat.title}
            variant="stack-parallax"
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
          />
        </RetreatSection>
      )}

      {hasDarkBlueSections && (
        <div className="overflow-hidden">
          <WaveSeparator
            variant="bold"
            colorClassName="text-brand-blue-dark"
            heightClassName="h-16 md:h-28"
          />

          {/* Accommodation section */}
          {hasAccommodationContent && (
            <RetreatSection
              className="bg-brand-blue-dark text-center"
              type="full"
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
              className="bg-brand-blue-dark text-center"
              type="full"
            >
              <section className="space-y-4">
                <Title className="text-2xl text-white">
                  Llegadas y transfers
                </Title>
                <p className="text-white leading-relaxed">{arrivalIntro}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {arrivalOptions.map((item, index) => (
                    <div
                      key={item.title}
                      className={`p-4 border-2 rounded-lg shadow-sm ${
                        index === 0 ? "" : "border-white/15 bg-white"
                      }`}
                      style={
                        index === 0
                          ? {
                              borderColor: "#4f73c3",
                              backgroundColor: "#faf8f4",
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold">{item.title}</p>
                        {index === 0 && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-brand-blue-medium text-white uppercase tracking-wide">
                            Recomendada
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-black/80">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </RetreatSection>
          )}

          <WaveSeparator
            variant="bold"
            flip
            colorClassName="text-brand-blue-dark"
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

    </div>
  );
}
