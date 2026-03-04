import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request);
  if (auth instanceof Response) return auth;

  return NextResponse.json({
    user: {
      id: auth.userId,
      email: auth.email,
      role: auth.role,
      permissions: Array.from(auth.permissions),
    },
  });
}
