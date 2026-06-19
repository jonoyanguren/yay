import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "event-registrations:read");
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId")?.trim() || undefined;
    const status = searchParams.get("status")?.trim() || undefined;

    const registrations = await prisma.eventRegistration.findMany({
      where: {
        ...(eventId ? { eventId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        event: {
          select: { id: true, slug: true, title: true, date: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return NextResponse.json(
      { error: "Error fetching registrations" },
      { status: 500 },
    );
  }
}
