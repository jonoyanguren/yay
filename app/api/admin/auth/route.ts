import { NextResponse } from "next/server";

/**
 * Legacy endpoint kept for compatibility.
 * New auth flow:
 * - POST /api/admin/auth/login
 * - POST /api/admin/auth/logout
 * - GET  /api/admin/auth/me
 */
export async function POST() {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use /api/admin/auth/login" },
    { status: 410 },
  );
}
