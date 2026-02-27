import Image from "next/image";
import Title from "@/components/ui/Title";

interface ExperienceSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function ExperienceSection({
  title,
  description,
  imageSrc,
  imageAlt,
}: ExperienceSectionProps) {
  const isExternalImage =
    imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  return (
    <section className="grid gap-6 md:gap-8 md:grid-cols-2 md:items-start">
      <div>
        <Title className="text-2xl mb-4 text-brand-blue-medium">{title}</Title>
        <p className="text-lg text-brand-blue-dark leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray/10 bg-gray/5 aspect-4/3">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={isExternalImage}
        />
      </div>
    </section>
  );
}
