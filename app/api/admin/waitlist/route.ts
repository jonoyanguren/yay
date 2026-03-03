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
    const where =
      status && status !== "all"
        ? {
            status,
          }
        : undefined;

    const entries = await prisma.waitlistEntry.findMany({
      where,
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
