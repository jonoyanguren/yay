import { notFound } from "next/navigation";
import RetreatDetailsView from "@/components/retreats/RetreatDetailsView";
import { prisma } from "@/lib/prisma";
import { getRetreatCapacity } from "@/lib/retreat-capacity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getRetreatBySlug(slug: string) {
  return await prisma.retreat.findUnique({ where: { slug } });
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);

  if (!retreat) {
    notFound();
  }

  const { maxPeople, spotsLeft, isSoldOut } = await getRetreatCapacity(retreat.id);

  return (
    <RetreatDetailsView
      retreat={retreat}
      maxPeople={maxPeople}
      spotsLeft={spotsLeft}
      isSoldOut={isSoldOut}
      mode="preview"
    />
  );
}
