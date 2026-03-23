import Image from "next/image";
import Link from "next/link";
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

interface DayItem {
  day: string;
  items: string[];
}

interface RetreatTextHighlights {
  fullDescription?: string[];
}

interface RetreatDetailsData {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  activitiesImage?: string | null;
  arrivalIntro?: string | null;
  arrivalOptions?: unknown;
  hotelName?: string | null;
  hotelUrl?: string | null;
  videoUrl?: string | null;
  accommodationTitle?: string | null;
  accommodationDescription?: string | null;
  accommodationImages?: string[];
  dayByDay?: unknown;
  includes?: unknown;
  notIncludes?: unknown;
  bgColor?: string | null;
  textHighlights?: unknown;
}

interface RetreatDetailsViewProps {
  retreat: RetreatDetailsData;
  maxPeople: number;
  spotsLeft: number;
  isSoldOut: boolean;
  mode?: "public" | "preview";
}

function normalizeHighlights(value: unknown): RetreatTextHighlights {
  const empty: RetreatTextHighlights = { fullDescription: [] };
  if (!value) return empty;

  let parsed: unknown = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return empty;
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return empty;
  const source = parsed as Record<string, unknown>;
  const asStringArray = (input: unknown) =>
    Array.isArray(input)
      ? input.filter((item): item is string => typeof item === "string")
      : [];

  return { fullDescription: asStringArray(source.fullDescription) };
}

function PreviewInfoCard({ slug }: { slug: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 -mt-1">
      <div className="border border-violet-200 bg-violet-50 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-violet-800 text-sm md:text-base">
          Modo preview activo. Esta versión todavía no está publicada.
        </p>
        <Link
          href={`/admin/retreats/${slug}/edit`}
          className="inline-flex items-center justify-center rounded-lg bg-violet-700 text-white px-4 py-2 text-sm font-medium hover:bg-violet-800 transition-colors"
        >
          Editar retiro
        </Link>
      </div>
    </div>
  );
}

export default function RetreatDetailsView({
  retreat,
  maxPeople,
  spotsLeft,
  isSoldOut,
  mode = "public",
}: RetreatDetailsViewProps) {
  const isPreview = mode === "preview";
  const bgColor = retreat.bgColor?.trim() || "#d77a61";
  const arrivalOptions = (Array.isArray(retreat.arrivalOptions)
    ? retreat.arrivalOptions
    : []) as ArrivalOption[];
  const arrivalIntro =
    retreat.arrivalIntro ??
    "Llega como quieras: te ayudamos a coordinar vuelos, coche o transfer para que encaje con el grupo y con tus horarios.";
  const dayByDay = (Array.isArray(retreat.dayByDay) ? retreat.dayByDay : []) as DayItem[];
  const hotelName = retreat.hotelName?.trim() || "";
  const hotelUrl = retreat.hotelUrl?.trim() || "";
  const videoUrl = retreat.videoUrl?.trim() || "";
  const accommodationTitle = retreat.accommodationTitle?.trim() || "Accommodation";
  const accommodationDescription = retreat.accommodationDescription?.trim() || "";
  const accommodationImages = retreat.accommodationImages || [];
  const hasAccommodationContent =
    Boolean(accommodationDescription) || accommodationImages.length > 0;
  const hasColoredSections = hasAccommodationContent || arrivalOptions.length > 0;
  const includes = (Array.isArray(retreat.includes) ? retreat.includes : []) as string[];
  const notIncludes = (Array.isArray(retreat.notIncludes)
    ? retreat.notIncludes
    : []) as string[];
  const activitiesImageRaw = retreat.activitiesImage?.trim() || "";
  const activitiesImage =
    activitiesImageRaw && !activitiesImageRaw.startsWith("/assets/")
      ? activitiesImageRaw
      : retreat.images?.[0] || retreat.image || "";
  const imageUrl = retreat.images?.[0] || retreat.image || "/assets/placeholder.jpg";
  const galleryImages = retreat.images || [];
  const textHighlights = normalizeHighlights(retreat.textHighlights);

  return (
    <div className="pb-24">
      <ScrollToTopOnMount />
      {!isPreview && (
        <TrackMetaOnMount
          eventName="ViewContent"
          params={{
            content_ids: [retreat.id],
            content_name: retreat.title,
            content_type: "product",
          }}
        />
      )}
      {isPreview && (
        <div className="bg-violet-600 text-white py-3 px-4 text-center text-sm font-medium">
          Preview Mode - Esta versión aún no está publicada
        </div>
      )}
      <section>
        <RetreatHero
          title={retreat.title}
          location={retreat.location}
          date={retreat.date}
          imageUrl={imageUrl}
        />
      </section>

      {!isPreview && (
        <>
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
        </>
      )}

      {isPreview && <PreviewInfoCard slug={retreat.slug} />}

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
              <ArrivalOptionsSection intro={arrivalIntro} options={arrivalOptions} />
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
                    <span className="text-black/40 font-bold">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </RetreatSection>
      )}

      {!isPreview && (
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
      )}
    </div>
  );
}
