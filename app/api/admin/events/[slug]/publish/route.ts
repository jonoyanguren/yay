import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdminAuth(request, "events:write");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    const current = await prisma.event.findUnique({
      where: { slug },
      select: { published: true },
    });
    if (!current) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const nextPublished = !current.published;
    const event = await prisma.event.update({
      where: { slug },
      data: {
        published: nextPublished,
        ...(nextPublished ? { hideFromWeb: false } : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error toggling event publish:", error);
    return NextResponse.json(
      { error: "Error toggling publish status" },
      { status: 500 },
    );
  }
}
