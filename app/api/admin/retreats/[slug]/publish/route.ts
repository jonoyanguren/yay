import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { logAdminAuditEvent } from "@/lib/admin-audit";

/**
 * POST /api/admin/retreats/[slug]/publish
 * Toggles the published status of a retreat
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdminAuth(request, "retreats:write");
  if (auth instanceof Response) return auth;

  try {
    const { slug } = await params;
    
    // Get current retreat to toggle published status
    const currentRetreat = await prisma.retreat.findUnique({
      where: { slug },
      select: { published: true, slug: true },
    });

    if (!currentRetreat) {
      return NextResponse.json(
        { error: "Retreat not found" },
        { status: 404 }
      );
    }

    // Toggle published status
    const retreat = await prisma.retreat.update({
      where: { slug },
      data: { published: !currentRetreat.published },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/retreats");
    revalidatePath(`/retreats/${retreat.slug}`);

    logAdminAuditEvent({
      event: "retreat_publish_toggle",
      status: "success",
      userId: auth.userId,
      email: auth.email,
      role: auth.role,
      route: "/api/admin/retreats/[slug]/publish",
    });

    return NextResponse.json(retreat);
  } catch (error: unknown) {
    console.error("Error toggling publish status:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Retreat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error toggling publish status" },
      { status: 500 }
    );
  }
}
