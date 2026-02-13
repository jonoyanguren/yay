import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

/**
 * GET /api/admin/retreats/[slug]
 * Returns a single retreat by slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { slug } = await params;

    const retreat = await prisma.retreat.findUnique({
      where: { slug },
      include: {
        roomTypes: true,
        extraActivities: true,
      },
    });

    if (!retreat) {
      return NextResponse.json({ error: "Retreat not found" }, { status: 404 });
    }

    return NextResponse.json(retreat);
  } catch (error) {
    console.error("Error fetching retreat:", error);
    return NextResponse.json(
      { error: "Error fetching retreat" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/retreats/[slug]
 * Updates a retreat
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const data = await request.json();

    // Update retreat with nested relations
    const updateData: any = {
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.fullDescription !== undefined && {
        fullDescription: data.fullDescription,
      }),
      ...(data.activities !== undefined && { activities: data.activities }),
      ...(data.program !== undefined && { program: data.program }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.maxPeople !== undefined && { maxPeople: data.maxPeople }),
      ...(data.published !== undefined && { published: data.published }),
      ...(data.arrivalIntro !== undefined && {
        arrivalIntro: data.arrivalIntro,
      }),
      ...(data.arrivalOptions !== undefined && {
        arrivalOptions: data.arrivalOptions,
      }),
      ...(data.dayByDay !== undefined && { dayByDay: data.dayByDay }),
      ...(data.includes !== undefined && { includes: data.includes }),
      ...(data.notIncludes !== undefined && { notIncludes: data.notIncludes }),
      ...(data.extraIdeas !== undefined && { extraIdeas: data.extraIdeas }),
    };

    const existingRetreat = await prisma.retreat.findUnique({
      where: { slug },
      include: { roomTypes: true, extraActivities: true },
    });
    if (!existingRetreat) {
      return NextResponse.json({ error: "Retreat not found" }, { status: 404 });
    }

    await prisma.retreat.update({
      where: { slug },
      data: updateData,
    });

    // Room types: update existing (by id) or create new. No deletes.
    if (data.roomTypes !== undefined) {
      const existingRoomIds = new Set(existingRetreat.roomTypes.map((e) => e.id));
      for (const rt of data.roomTypes as Array<{
        id?: string;
        name: string;
        description?: string;
        images?: string[];
        priceCents: number;
        maxQuantity: number;
      }>) {
        const payload = {
          name: rt.name,
          description: rt.description ?? "",
          images: rt.images ?? [],
          priceCents: rt.priceCents,
          maxQuantity: rt.maxQuantity,
        };
        if (rt.id && existingRoomIds.has(rt.id)) {
          await prisma.retreatRoomType.update({
            where: { id: rt.id },
            data: payload,
          });
        } else {
          await prisma.retreatRoomType.create({
            data: { retreatId: existingRetreat.id, ...payload },
          });
        }
      }
    }

    // Extra activities: update existing (by id) or create new. No deletes.
    if (data.extraActivities !== undefined) {
      const existingExtraIds = new Set(
        existingRetreat.extraActivities.map((e) => e.id)
      );
      for (const ea of data.extraActivities as Array<{
        id?: string;
        name: string;
        description?: string;
        images?: string[];
        priceCents: number;
        allowMultiple: boolean;
        maxQuantity: number | null;
        link?: string | null;
      }>) {
        const payload = {
          name: ea.name,
          description: ea.description ?? "",
          images: ea.images ?? [],
          priceCents: ea.priceCents,
          allowMultiple: ea.allowMultiple,
          maxQuantity: ea.maxQuantity,
          link: ea.link ?? null,
        };
        if (ea.id && existingExtraIds.has(ea.id)) {
          await prisma.retreatExtraActivity.update({
            where: { id: ea.id },
            data: payload,
          });
        } else {
          await prisma.retreatExtraActivity.create({
            data: { retreatId: existingRetreat.id, ...payload },
          });
        }
      }
    }

    const retreat = await prisma.retreat.findUnique({
      where: { slug },
      include: { roomTypes: true, extraActivities: true },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/retreats");
    revalidatePath(`/retreats/${retreat.slug}`);

    return NextResponse.json(retreat);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Error updating retreat:", error);

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Retreat not found" },
          { status: 404 },
        );
      }

      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A retreat with this slug already exists" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Error updating retreat" },
        { status: 500 },
      );
    }
  }
}

/**
 * DELETE /api/admin/retreats/[slug]
 * Deletes a retreat
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { slug } = await params;

    await prisma.retreat.delete({
      where: { slug },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/retreats");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting retreat:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Retreat not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error deleting retreat" },
      { status: 500 },
    );
  }
}
