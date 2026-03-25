import type { Metadata } from "next";
import RetreatDetailsView from "@/components/retreats/RetreatDetailsView";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRetreatCapacity } from "@/lib/retreat-capacity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const retreats = await prisma.retreat.findMany({
    where: { published: true, hideFromWeb: false },
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
      hideFromWeb: false,
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

  if (!retreat) {
    notFound();
  }

  const { maxPeople, spotsLeft, isSoldOut } = await getRetreatCapacity(
    retreat.id,
  );

  const imageUrl =
    retreat.images?.[0] || retreat.image || "/assets/placeholder.jpg";
  const galleryImages = retreat.images || [];
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
        !isSoldOut
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <RetreatDetailsView
        retreat={retreat}
        maxPeople={maxPeople}
        spotsLeft={spotsLeft}
        isSoldOut={isSoldOut}
      />
    </div>
  );
}
