import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, verifyAdminJwt } from "@/lib/admin-jwt";

async function hasValidSessionCookie(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (!token) return false;

  try {
    await verifyAdminJwt(token);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const isLoginRoute = pathname === "/admin/login";
  const isAuthenticated = await hasValidSessionCookie(request);

  if (!isLoginRoute && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAuthenticated) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
