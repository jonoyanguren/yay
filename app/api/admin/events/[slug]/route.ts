import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdminAuth(request, "events:read");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Error fetching event" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdminAuth(request, "events:write");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const data = await request.json();

    const updateData: Prisma.EventUpdateInput = {
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.fullDescription !== undefined && {
        fullDescription: data.fullDescription,
      }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.images !== undefined && {
        images: Array.isArray(data.images) ? data.images.slice(0, 2) : [],
      }),
      ...(data.priceCents !== undefined && {
        priceCents: Math.max(0, Number(data.priceCents) || 0),
      }),
      ...(data.maxAttendees !== undefined && {
        maxAttendees: Math.max(1, Number(data.maxAttendees) || 1),
      }),
      ...(data.published !== undefined && { published: Boolean(data.published) }),
      ...(data.hideFromWeb !== undefined && {
        hideFromWeb: Boolean(data.hideFromWeb),
      }),
      ...(data.forceSoldOut !== undefined && {
        forceSoldOut: Boolean(data.forceSoldOut),
      }),
      ...(data.sortOrder !== undefined && {
        sortOrder: Number(data.sortOrder) || 0,
      }),
    };

    const event = await prisma.event.update({
      where: { slug },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    if (slug !== event.slug) {
      revalidatePath(`/events/${slug}`);
    }

    return NextResponse.json(event);
  } catch (error: unknown) {
    console.error("Error updating event:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error updating event" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdminAuth(request, "events:write");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const force = new URL(request.url).searchParams.get("force") === "1";

    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const paidCount = await prisma.eventRegistration.count({
      where: { eventId: event.id, status: "paid" },
    });
    if (paidCount > 0 && !force) {
      return NextResponse.json(
        {
          error: `Hay ${paidCount} inscripción(es) pagada(s). Confirma el borrado forzado.`,
          paidCount,
          requiresForce: true,
        },
        { status: 409 },
      );
    }

    await prisma.$transaction([
      prisma.eventRegistration.deleteMany({ where: { eventId: event.id } }),
      prisma.event.delete({ where: { id: event.id } }),
    ]);

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}
