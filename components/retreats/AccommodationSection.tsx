import Title from "@/components/ui/Title";

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
            <Title className="text-3xl italic font-light text-white/90">
              {hotelName}
            </Title>
          )}
        </Title>
      )}
      {description && (
        <p className="text-2xl font-extralight text-white/90 mb-12">
          {description}
        </p>
      )}
      {stripImages.length > 0 && (
        <div className="w-full">
          <div className="flex justify-center gap-0">
            {stripImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="w-[20vw] min-w-[96px] max-w-[280px] aspect-square shrink-0 overflow-hidden bg-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {videoUrl && (
        <div className="pt-2">
          <video
            src={videoUrl}
            controls
            preload="metadata"
            className="w-full max-w-4xl mx-auto rounded-md"
          />
        </div>
      )}
    </section>
  );
}
