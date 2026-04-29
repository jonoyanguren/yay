import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * POST /api/admin/retreats/reorder
 * Persists manual retreat ordering from admin panel.
 */
export async function POST(request: Request) {
  const auth = await requireAdminAuth(request, "retreats:write");
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const retreatIds = Array.isArray(body?.retreatIds) ? body.retreatIds : null;

    if (!retreatIds || retreatIds.some((id) => typeof id !== "string")) {
      return NextResponse.json(
        { error: "retreatIds inválido" },
        { status: 400 },
      );
    }

    await prisma.$transaction(
      retreatIds.map((id: string, index: number) =>
        prisma.retreat.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    revalidatePath("/");
    revalidatePath("/retreats");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering retreats:", error);
    return NextResponse.json(
      { error: "Error reordenando retiros" },
      { status: 500 },
    );
  }
}
