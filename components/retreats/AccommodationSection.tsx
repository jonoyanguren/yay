import ImageGallery from "@/components/ImageGallery";
import Title from "@/components/ui/Title";

interface AccommodationSectionProps {
  title: string;
  description: string;
  images: string[];
}

export default function AccommodationSection({
  title,
  description,
  images,
}: AccommodationSectionProps) {
  return (
    <section className="space-y-5">
      <Title className="text-2xl text-white">{title}</Title>
      {description && (
        <p className="text-white/90 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}
      {images.length > 0 && (
        <ImageGallery
          images={images}
          altPrefix={title}
          variant="full"
          className="md:grid-cols-2 lg:grid-cols-3"
        />
      )}
    </section>
  );
}
