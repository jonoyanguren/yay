import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/bookings
 * Returns all bookings with related data
 */
export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        retreat: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        roomSlots: {
          include: {
            retreatRoomType: {
              select: {
                name: true,
                priceCents: true,
              },
            },
          },
        },
        extras: {
          include: {
            retreatExtraActivity: {
              select: {
                name: true,
                priceCents: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error fetching bookings" },
      { status: 500 }
    );
  }
}
