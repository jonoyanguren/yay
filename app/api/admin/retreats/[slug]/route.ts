import { requireAdminAuth } from "@/lib/auth";
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
  const auth = await requireAdminAuth(request, "retreats:read");
  if (auth instanceof Response) return auth;

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
  const auth = await requireAdminAuth(request, "retreats:write");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const data = await request.json();

    // Update retreat with nested relations
    const updateData: Record<string, unknown> = {
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.fullDescription !== undefined && {
        fullDescription: data.fullDescription,
      }),
      ...(data.activitiesImage !== undefined && {
        activitiesImage: data.activitiesImage,
      }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.reservationDepositCents !== undefined && {
        reservationDepositCents: Math.max(
          0,
          Number(data.reservationDepositCents) || 0,
        ),
      }),
      ...(data.chargeFullAmount !== undefined && {
        chargeFullAmount: Boolean(data.chargeFullAmount),
      }),
      ...(data.published !== undefined && { published: data.published }),
      ...(data.forceSoldOut !== undefined && {
        forceSoldOut: Boolean(data.forceSoldOut),
      }),
      ...(data.arrivalIntro !== undefined && {
        arrivalIntro: data.arrivalIntro,
      }),
      ...(data.arrivalOptions !== undefined && {
        arrivalOptions: data.arrivalOptions,
      }),
      ...(data.hotelName !== undefined && {
        hotelName: data.hotelName,
      }),
      ...(data.hotelUrl !== undefined && {
        hotelUrl: data.hotelUrl,
      }),
      ...(data.videoUrl !== undefined && {
        videoUrl: data.videoUrl,
      }),
      ...(data.accommodationTitle !== undefined && {
        accommodationTitle: data.accommodationTitle,
      }),
      ...(data.accommodationDescription !== undefined && {
        accommodationDescription: data.accommodationDescription,
      }),
      ...(data.accommodationImages !== undefined && {
        accommodationImages: data.accommodationImages,
      }),
      ...(data.dayByDay !== undefined && { dayByDay: data.dayByDay }),
      ...(data.includes !== undefined && { includes: data.includes }),
      ...(data.notIncludes !== undefined && { notIncludes: data.notIncludes }),
      ...(data.bgColor !== undefined && { bgColor: data.bgColor }),
      ...(data.textHighlights !== undefined && {
        textHighlights: data.textHighlights,
      }),
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

    // Room types: sync exact payload (update/create/delete).
    if (data.roomTypes !== undefined) {
      const existingRoomIds = new Set(existingRetreat.roomTypes.map((e) => e.id));
      const roomPayload = data.roomTypes as Array<{
        id?: string;
        name: string;
        description?: string;
        images?: string[];
        priceCents: number;
        maxPeople?: number;
      }>;
      const incomingRoomIds = roomPayload
        .map((rt) => rt.id)
        .filter((id): id is string => Boolean(id));

      if (incomingRoomIds.length > 0) {
        await prisma.retreatRoomType.deleteMany({
          where: {
            retreatId: existingRetreat.id,
            id: { notIn: incomingRoomIds },
          },
        });
      } else {
        await prisma.retreatRoomType.deleteMany({
          where: { retreatId: existingRetreat.id },
        });
      }

      for (const rt of roomPayload) {
        const payload = {
          name: rt.name,
          description: rt.description ?? "",
          images: rt.images ?? [],
          priceCents: rt.priceCents,
          maxPeople: Math.max(1, Number(rt.maxPeople ?? 1)),
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

    // Extra activities: sync exact payload (update/create/delete).
    if (data.extraActivities !== undefined) {
      const existingExtraIds = new Set(
        existingRetreat.extraActivities.map((e) => e.id)
      );
      const extraPayload = data.extraActivities as Array<{
        id?: string;
        name: string;
        description?: string;
        images?: string[];
        priceCents: number;
        allowMultiple: boolean;
        maxQuantity: number | null;
        link?: string | null;
      }>;
      const incomingExtraIds = extraPayload
        .map((ea) => ea.id)
        .filter((id): id is string => Boolean(id));

      if (incomingExtraIds.length > 0) {
        await prisma.retreatExtraActivity.deleteMany({
          where: {
            retreatId: existingRetreat.id,
            id: { notIn: incomingExtraIds },
          },
        });
      } else {
        await prisma.retreatExtraActivity.deleteMany({
          where: { retreatId: existingRetreat.id },
        });
      }

      for (const ea of extraPayload) {
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

    if (!retreat) {
      return NextResponse.json(
        { error: "Retreat not found" },
        { status: 404 },
      );
    }

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/retreats");
    revalidatePath(`/retreats/${retreat.slug}`);

    return NextResponse.json(retreat);
  } catch (error: unknown) {
    console.error("Error updating retreat:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

    return NextResponse.json(
      { error: "Error updating retreat" },
      { status: 500 },
    );
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
  const auth = await requireAdminAuth(request, "retreats:write");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const retreat = await prisma.retreat.findUnique({
      where: { slug },
      select: { id: true, slug: true },
    });
    if (!retreat) {
      return NextResponse.json({ error: "Retreat not found" }, { status: 404 });
    }

    const bookingsCount = await prisma.booking.count({
      where: { retreatId: retreat.id },
    });
    if (bookingsCount > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede borrar este retiro porque tiene reservas asociadas.",
        },
        { status: 409 },
      );
    }

    await prisma.retreat.delete({
      where: { id: retreat.id },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/retreats");
    revalidatePath(`/retreats/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting retreat:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Retreat not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error deleting retreat" },
      { status: 500 },
    );
  }
}
