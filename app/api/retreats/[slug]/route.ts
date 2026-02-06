import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/retreats/[slug]
 * Returns a single published retreat by slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const retreat = await prisma.retreat.findUnique({
      where: { 
        slug,
        published: true,
      },
    });

    if (!retreat) {
      return NextResponse.json(
        { error: "Retreat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(retreat);
  } catch (error) {
    console.error("Error fetching retreat:", error);
    return NextResponse.json(
      { error: "Error fetching retreat" },
      { status: 500 }
    );
  }
}
