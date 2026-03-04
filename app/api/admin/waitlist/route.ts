import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/waitlist
 * Returns waitlist entries with retreat info
 */
export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const retreatId = searchParams.get("retreatId");
    const where: {
      status?: string;
      retreatId?: string;
    } = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (retreatId && retreatId !== "all") {
      where.retreatId = retreatId;
    }

    const entries = await prisma.waitlistEntry.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        retreat: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching waitlist entries:", error);
    return NextResponse.json(
      { error: "Error fetching waitlist entries" },
      { status: 500 },
    );
  }
}
