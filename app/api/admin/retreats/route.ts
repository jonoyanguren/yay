import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/retreats
 * Returns all retreats (published and unpublished)
 */
export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const retreats = await prisma.retreat.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        roomTypes: true,
        extraActivities: true,
      },
    });

    return NextResponse.json(retreats);
  } catch (error) {
    console.error("Error fetching retreats:", error);
    return NextResponse.json(
      { error: "Error fetching retreats" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/retreats
 * Creates a new retreat
 */
export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.slug || !data.title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const retreat = await prisma.retreat.create({
      data: {
        slug: data.slug,
        title: data.title,
        location: data.location || "",
        description: data.description || "",
        fullDescription: data.fullDescription || "",
        activities: data.activities || [],
        program: data.program || [],
        image: data.image || "",
        date: data.date || "",
        price: data.price || "",
        published: data.published || false,
        arrivalIntro: data.arrivalIntro || null,
        arrivalOptions: data.arrivalOptions || null,
        dayByDay: data.dayByDay || null,
        includes: data.includes || null,
        notIncludes: data.notIncludes || null,
        extraIdeas: data.extraIdeas || null,
        roomTypes: data.roomTypes
          ? {
              create: data.roomTypes.map((rt: any) => ({
                name: rt.name,
                priceCents: rt.priceCents,
                maxQuantity: rt.maxQuantity,
              })),
            }
          : undefined,
        extraActivities: data.extraActivities
          ? {
              create: data.extraActivities.map((ea: any) => ({
                name: ea.name,
                description: ea.description,
                priceCents: ea.priceCents,
                allowMultiple: ea.allowMultiple,
                maxQuantity: ea.maxQuantity,
                link: ea.link,
              })),
            }
          : undefined,
      },
      include: {
        roomTypes: true,
        extraActivities: true,
      },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/retreats");

    return NextResponse.json(retreat, { status: 201 });
  } catch (error: any) {
    console.error("Error creating retreat:", error);
    
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A retreat with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error creating retreat" },
      { status: 500 }
    );
  }
}
