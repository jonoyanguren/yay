import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["pending", "contacted", "closed"] as const;

/**
 * PATCH /api/admin/waitlist/[id]
 * Updates waitlist entry status/notes
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(request, "waitlist:write");
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const data = await request.json();
    const updateData: { status?: string; notes?: string | null } = {};

    if (data.status !== undefined) {
      if (!VALID_STATUSES.includes(data.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      updateData.status = data.status;
    }

    if (data.notes !== undefined) {
      updateData.notes =
        typeof data.notes === "string" ? data.notes.trim() : null;
    }

    const entry = await prisma.waitlistEntry.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(entry);
  } catch (error: any) {
    console.error("Error updating waitlist entry:", error);
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Waitlist entry not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Error updating waitlist entry" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/waitlist/[id]
 * Deletes a waitlist entry
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(request, "waitlist:write");
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    await prisma.waitlistEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting waitlist entry:", error);
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Waitlist entry not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Error deleting waitlist entry" },
      { status: 500 },
    );
  }
}
