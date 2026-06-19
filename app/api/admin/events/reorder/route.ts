import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const auth = await requireAdminAuth(request, "events:write");
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const orderedSlugs = body.orderedSlugs as string[] | undefined;
    if (!Array.isArray(orderedSlugs) || orderedSlugs.length === 0) {
      return NextResponse.json({ error: "orderedSlugs required" }, { status: 400 });
    }

    await prisma.$transaction(
      orderedSlugs.map((slug, index) =>
        prisma.event.update({
          where: { slug },
          data: { sortOrder: index },
        }),
      ),
    );

    revalidatePath("/events");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering events:", error);
    return NextResponse.json({ error: "Error reordering events" }, { status: 500 });
  }
}
