import Title from "@/components/ui/Title";
import { resolveVideoEmbed } from "@/lib/videoEmbed";

interface AccommodationSectionProps {
  title: string;
  description: string;
  images: string[];
  hotelName?: string;
  hotelUrl?: string;
  videoUrl?: string;
}

export default function AccommodationSection({
  title,
  description,
  images,
  hotelName = "",
  hotelUrl = "",
  videoUrl = "",
}: AccommodationSectionProps) {
  const { kind, embedSrc } = resolveVideoEmbed(videoUrl);

  const stripImages =
    images.length === 0
      ? []
      : images.length < 4
        ? Array.from({ length: 4 }, (_, index) => images[index % images.length])
        : images.slice(0, 5);

  return (
    <section className="space-y-5">
      <Title className="text-5xl text-white">{title}</Title>
      {hotelName && (
        <Title className="text-3xl italic font-extralight text-white/90">
          {hotelUrl ? (
            <a
              href={hotelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              {hotelName}
            </a>
          ) : (
            <span className="text-3xl italic font-light text-white/90">
              {hotelName}
            </span>
          )}
        </Title>
      )}
      {description && (
        <p className="text-xl font-extralight text-white/90 mb-12">
          {description}
        </p>
      )}
      {stripImages.length > 0 && (
        <div className="w-full px-10 md:px-0">
          <div className="flex flex-col md:flex-row md:justify-center gap-2 md:gap-0">
            {stripImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="w-full md:w-[20vw] md:min-w-[96px] md:max-w-[280px] aspect-square shrink-0 overflow-hidden rounded-xl md:rounded-none bg-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Alojamiento de ${title} - foto ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {videoUrl.trim() && (
        <div className="pt-2 w-full max-w-4xl mx-auto">
          <div className="relative w-full aspect-video overflow-hidden rounded-md bg-black">
            {kind !== "file" && embedSrc ? (
              <iframe
                src={embedSrc}
                title={`Vídeo de alojamiento — ${title}`}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl.trim()}
                controls
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
