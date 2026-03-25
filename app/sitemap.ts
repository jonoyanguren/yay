import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const retreats = await prisma.retreat.findMany({
    where: { published: true, hideFromWeb: false },
    select: { slug: true, createdAt: true },
  });

  const retreatRoutes: MetadataRoute.Sitemap = retreats.map((retreat) => ({
    url: `${siteUrl}/retreats/${retreat.slug}`,
    lastModified: retreat.createdAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...retreatRoutes];
}
