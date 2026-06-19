import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "events:read");
  if (auth instanceof Response) return auth;

  try {
    const events = await prisma.event.findMany({
      orderBy: [
        { hideFromWeb: "asc" },
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminAuth(request, "events:write");
  if (auth instanceof Response) return auth;

  try {
    const data = await request.json();

    if (!data.slug?.trim() || !data.title?.trim()) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 },
      );
    }

    const priceCents = Math.max(0, Number(data.priceCents) || 0);
    const maxAttendees = Math.max(1, Number(data.maxAttendees) || 1);

    const maxSortOrder = await prisma.event.aggregate({
      _max: { sortOrder: true },
    });

    const event = await prisma.event.create({
      data: {
        slug: data.slug.trim(),
        title: data.title.trim(),
        description: data.description || "",
        fullDescription: data.fullDescription || "",
        location: data.location || "",
        date: data.date || "",
        image: data.image || "",
        images: Array.isArray(data.images) ? data.images.slice(0, 2) : [],
        priceCents,
        maxAttendees,
        published: Boolean(data.published),
        hideFromWeb: Boolean(data.hideFromWeb),
        forceSoldOut: Boolean(data.forceSoldOut),
        sortOrder:
          data.sortOrder != null
            ? Number(data.sortOrder) || 0
            : (maxSortOrder._max.sortOrder ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return NextResponse.json(event, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}
