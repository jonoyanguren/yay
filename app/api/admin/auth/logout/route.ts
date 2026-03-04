import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, verifyAdminJwt } from "@/lib/admin-jwt";
import { getAdminCookieOptions, revokeAdminSessionByTokenId } from "@/lib/auth";
import { logAdminAuditEvent } from "@/lib/admin-audit";

function getCookieValue(cookieHeader: string, key: string) {
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));
  if (!entry) return "";
  return decodeURIComponent(entry.split("=").slice(1).join("="));
}

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  try {
    const token = getCookieValue(request.headers.get("cookie") || "", ADMIN_AUTH_COOKIE);
    if (token) {
      const payload = await verifyAdminJwt(token);
      await revokeAdminSessionByTokenId(payload.sid);
      logAdminAuditEvent({
        event: "logout",
        status: "success",
        userId: payload.sub,
        role: payload.role,
        route: "/api/admin/auth/logout",
      });
    }
  } catch (error) {
    console.error("Admin logout error:", error);
  }

  response.cookies.set(ADMIN_AUTH_COOKIE, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
  return response;
}
