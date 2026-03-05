/**
 * Seed retreats base content only.
 * Run: npm run seed (requires DATABASE_URL in env or .env.local)
 */
import { prisma } from "../lib/prisma";
import { retreats } from "../lib/data";
import { RESERVATION_PAYMENT_CENTS } from "../lib/stripe-config";

async function seed() {
  console.info("Seeding retreats (full content)...");
  for (const r of retreats) {
    await prisma.retreat.upsert({
      where: { slug: r.slug },
      create: {
        slug: r.slug,
        title: r.title,
        location: r.location,
        description: r.description,
        fullDescription: r.fullDescription,
        activitiesImage: r.activitiesImage ?? null,
        image: r.image,
        images: r.images ?? [],
        date: r.date,
        price: r.price,
        reservationDepositCents: RESERVATION_PAYMENT_CENTS,
        chargeFullAmount: false,
        published: true, // Published by default
        arrivalIntro: r.arrivalIntro ?? null,
        arrivalOptions: r.arrivalOptions ?? undefined,
        hotelName: r.hotelName ?? null,
        hotelUrl: r.hotelUrl ?? null,
        videoUrl: r.videoUrl ?? null,
        accommodationTitle: r.accommodationTitle ?? null,
        accommodationDescription: r.accommodationDescription ?? null,
        accommodationImages: r.accommodationImages ?? [],
        dayByDay: r.dayByDay ?? undefined,
        includes: r.includes ?? undefined,
        notIncludes: r.notIncludes ?? undefined,
      },
      update: {
        title: r.title,
        location: r.location,
        description: r.description,
        fullDescription: r.fullDescription,
        activitiesImage: r.activitiesImage ?? null,
        image: r.image,
        images: r.images ?? [],
        date: r.date,
        price: r.price,
        published: true, // Keep published on update
        arrivalIntro: r.arrivalIntro ?? null,
        arrivalOptions: r.arrivalOptions ?? undefined,
        hotelName: r.hotelName ?? null,
        hotelUrl: r.hotelUrl ?? null,
        videoUrl: r.videoUrl ?? null,
        accommodationTitle: r.accommodationTitle ?? null,
        accommodationDescription: r.accommodationDescription ?? null,
        accommodationImages: r.accommodationImages ?? [],
        dayByDay: r.dayByDay ?? undefined,
        includes: r.includes ?? undefined,
        notIncludes: r.notIncludes ?? undefined,
      },
    });
  }

  console.info("Seed done.");
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
