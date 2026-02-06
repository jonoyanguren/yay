import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/retreats
 * Returns all published retreats
 */
export async function GET() {
  try {
    const retreats = await prisma.retreat.findMany({
      where: { published: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        location: true,
        description: true,
        fullDescription: true,
        activities: true,
        program: true,
        image: true,
        date: true,
        price: true,
        arrivalIntro: true,
        arrivalOptions: true,
        dayByDay: true,
        includes: true,
        notIncludes: true,
        extraIdeas: true,
        published: true,
        createdAt: true,
      },
    });

    return NextResponse.json(retreats);
  } catch (error) {
    console.error("Error fetching retreats:", error);
    return NextResponse.json(
      { error: "Error fetching retreats" },
      { status: 500 }
    );
  }
}
