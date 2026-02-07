/**
 * Seed retreats + room types + extra activities.
 * Run: npm run seed (requires DATABASE_URL in env or .env.local)
 */
import { prisma } from "../lib/prisma";
import { retreats } from "../lib/data";

async function seed() {
  console.log("Seeding retreats (full content)...");
  for (const r of retreats) {
    await prisma.retreat.upsert({
      where: { slug: r.slug },
      create: {
        slug: r.slug,
        title: r.title,
        location: r.location,
        description: r.description,
        fullDescription: r.fullDescription,
        activities: r.activities,
        program: r.program,
        image: r.image,
        date: r.date,
        price: r.price,
        published: true, // Published by default
        arrivalIntro: r.arrivalIntro ?? null,
        arrivalOptions: r.arrivalOptions ?? undefined,
        dayByDay: r.dayByDay ?? undefined,
        includes: r.includes ?? undefined,
        notIncludes: r.notIncludes ?? undefined,
        extraIdeas: r.extraIdeas ?? undefined,
      },
      update: {
        title: r.title,
        location: r.location,
        description: r.description,
        fullDescription: r.fullDescription,
        activities: r.activities,
        program: r.program,
        image: r.image,
        date: r.date,
        price: r.price,
        published: true, // Keep published on update
        arrivalIntro: r.arrivalIntro ?? null,
        arrivalOptions: r.arrivalOptions ?? undefined,
        dayByDay: r.dayByDay ?? undefined,
        includes: r.includes ?? undefined,
        notIncludes: r.notIncludes ?? undefined,
        extraIdeas: r.extraIdeas ?? undefined,
      },
    });
  }

  const retreatRows = await prisma.retreat.findMany({
    select: { id: true, slug: true },
  });
  const bySlug = Object.fromEntries(
    retreatRows.map((row: { id: string; slug: string }) => [row.slug, row.id])
  );

  console.log("Seeding room types and extras for sahara-calm...");
  const saharaId = bySlug["sahara-calm"];
  if (saharaId) {
    // Only seed if room types don't exist yet
    const existingRoomTypes = await prisma.retreatRoomType.findFirst({
      where: { retreatId: saharaId }
    });
    
    if (!existingRoomTypes) {
      await prisma.retreatRoomType.createMany({
        data: [
          { retreatId: saharaId, name: "Habitación doble compartida", description: "Habitación amplia con 2 camas individuales, baño privado y vistas al oasis", priceCents: 89000, maxQuantity: 8 },
          { retreatId: saharaId, name: "Habitación individual", description: "Habitación privada con cama king size, baño en suite y terraza con vistas al desierto", priceCents: 120000, maxQuantity: 4 },
          { retreatId: saharaId, name: "Cúpula premium", description: "Alojamiento exclusivo en cúpula geodésica con jacuzzi privado y experiencia glamping de lujo", priceCents: 150000, maxQuantity: 2 },
        ],
      });
    }
    
    // Check if extras exist
    const existingExtras = await prisma.retreatExtraActivity.findMany({
      where: { retreatId: saharaId }
    });
    
    if (existingExtras.length === 0) {
      // Create new extras if they don't exist
      await prisma.retreatExtraActivity.createMany({
        data: [
          { retreatId: saharaId, name: "Sesión de fotografía en el desierto", description: "Sesión fotográfica profesional de 2 horas durante el atardecer en las dunas", priceCents: 10000, allowMultiple: false, link: "https://www.instagram.com/sahara_photography" },
          { retreatId: saharaId, name: "Masaje relajante (1h)", description: "Masaje terapéutico de cuerpo completo con aceites naturales del Sahara", priceCents: 5500, allowMultiple: true, link: "https://www.example.com/spa-wellness" },
        ],
      });
    } else {
      // Update existing extras with links
      for (const extra of existingExtras) {
        if (extra.name.includes("fotografía")) {
          await prisma.retreatExtraActivity.update({
            where: { id: extra.id },
            data: { link: "https://www.instagram.com/sahara_photography" }
          });
        } else if (extra.name.includes("Masaje")) {
          await prisma.retreatExtraActivity.update({
            where: { id: extra.id },
            data: { link: "https://www.example.com/spa-wellness" }
          });
        }
      }
    }
  }

  const tropicalId = bySlug["tropical-relax"];
  if (tropicalId) {
    // Only seed if room types don't exist yet
    const existingRoomTypes = await prisma.retreatRoomType.findFirst({
      where: { retreatId: tropicalId }
    });
    
    if (!existingRoomTypes) {
      await prisma.retreatRoomType.createMany({
        data: [
          { retreatId: tropicalId, name: "Habitación doble", description: "Habitación doble con balcón privado y vistas al mar tropical", priceCents: 45000, maxQuantity: 6 },
          { retreatId: tropicalId, name: "Habitación individual", description: "Suite individual con terraza privada frente al océano", priceCents: 62000, maxQuantity: 2 },
        ],
      });
    }
    
    // Check if extras exist
    const existingExtras = await prisma.retreatExtraActivity.findMany({
      where: { retreatId: tropicalId }
    });
    
    if (existingExtras.length === 0) {
      // Create new extras if they don't exist
      await prisma.retreatExtraActivity.createMany({
        data: [
          { retreatId: tropicalId, name: "Sesión de surf privada", description: "Clase de surf personalizada de 90 minutos con instructor certificado", priceCents: 3500, allowMultiple: true, link: "https://www.example.com/surf-school" },
        ],
      });
    } else {
      // Update existing extras with links
      for (const extra of existingExtras) {
        if (extra.name.includes("surf")) {
          await prisma.retreatExtraActivity.update({
            where: { id: extra.id },
            data: { link: "https://www.example.com/surf-school" }
          });
        }
      }
    }
  }

  console.log("Seed done.");
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
