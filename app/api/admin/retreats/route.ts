import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

/**
 * GET /api/admin/retreats
 * Returns all retreats (published and unpublished)
 */
export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "retreats:read");
  if (auth instanceof Response) return auth;

  try {
    const retreats = await prisma.retreat.findMany({
      orderBy: [
        { hideFromWeb: "asc" },
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
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
  const auth = await requireAdminAuth(request, "retreats:write");
  if (auth instanceof Response) return auth;

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.slug || !data.title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const roomTypesPayload = Array.isArray(data.roomTypes) ? data.roomTypes : [];

    const maxSortOrder = await prisma.retreat.aggregate({
      _max: { sortOrder: true },
    });

    const retreat = await prisma.retreat.create({
      data: {
        slug: data.slug,
        title: data.title,
        location: data.location || "",
        description: data.description || "",
        fullDescription: data.fullDescription || "",
        activitiesImage: data.activitiesImage || null,
        image: data.image || "",
        images: data.images || [],
        date: data.date || "",
        price: data.price || "",
        reservationDepositCents:
          data.reservationDepositCents != null
            ? Math.max(0, Number(data.reservationDepositCents) || 0)
            : 60000,
        chargeFullAmount: Boolean(data.chargeFullAmount),
        published: data.published || false,
        hideFromWeb: Boolean(data.hideFromWeb),
        forceSoldOut: Boolean(data.forceSoldOut),
        arrivalIntro: data.arrivalIntro || null,
        arrivalOptions: data.arrivalOptions || null,
        hotelName: data.hotelName || null,
        hotelUrl: data.hotelUrl || null,
        videoUrl: data.videoUrl || null,
        accommodationTitle: data.accommodationTitle || null,
        accommodationDescription: data.accommodationDescription || null,
        accommodationImages: data.accommodationImages || [],
        dayByDay: data.dayByDay || null,
        includes: data.includes || null,
        notIncludes: data.notIncludes || null,
        bgColor: data.bgColor || null,
        textHighlights: data.textHighlights || null,
        featuredInfo: data.featuredInfo || null,
        sortOrder:
          data.sortOrder != null
            ? Number(data.sortOrder) || 0
            : (maxSortOrder._max.sortOrder ?? -1) + 1,
        roomTypes: roomTypesPayload.length > 0
          ? {
              create: roomTypesPayload.map(
                (rt: { name: string; description?: string; images?: string[]; priceCents: number; maxPeople?: number }) => ({
                name: rt.name,
                description: rt.description || "",
                images: rt.images || [],
                priceCents: rt.priceCents,
                maxPeople: Math.max(1, Number(rt.maxPeople ?? 1)),
              }),
            ),
            }
          : undefined,
        extraActivities: data.extraActivities
          ? {
              create: data.extraActivities.map((ea: {
                name: string;
                description?: string;
                images?: string[];
                priceCents: number;
                allowMultiple: boolean;
                maxQuantity: number | null;
                link?: string | null;
              }) => ({
                name: ea.name,
                description: ea.description || "",
                images: ea.images || [],
                priceCents: ea.priceCents,
                allowMultiple: ea.allowMultiple,
                maxQuantity: ea.maxQuantity,
                link: ea.link ?? null,
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
  } catch (error: unknown) {
    console.error("Error creating retreat:", error);
    
    // Handle unique constraint violation
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
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
