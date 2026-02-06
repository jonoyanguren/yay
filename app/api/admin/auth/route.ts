import { validateAdminPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * POST /api/admin/auth
 * Validates admin password
 */
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = validateAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error validating password:", error);
    return NextResponse.json(
      { error: "Error validating password" },
      { status: 500 }
    );
  }
}
