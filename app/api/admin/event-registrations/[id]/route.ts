import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(request, "event-registrations:write");
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
    }

    const force = new URL(request.url).searchParams.get("force") === "1";
    if (registration.status === "paid" && !force) {
      return NextResponse.json(
        {
          error:
            "Esta inscripción está pagada. Confirma el borrado forzado si es una prueba o error.",
          requiresForce: true,
        },
        { status: 409 },
      );
    }

    await prisma.eventRegistration.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting event registration:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Error al eliminar la inscripción" },
      { status: 500 },
    );
  }
}
