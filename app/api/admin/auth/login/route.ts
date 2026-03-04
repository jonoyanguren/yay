import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminSession, getAdminCookieOptions, verifyAdminPassword } from "@/lib/auth";
import { ADMIN_AUTH_COOKIE } from "@/lib/admin-jwt";
import { logAdminAuditEvent } from "@/lib/admin-audit";

const LOGIN_MAX_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rate = consumeRateLimit(`admin_login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) },
        },
      );
    }

    const { email, password } = await request.json().catch(() => ({}));
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const inputPassword = String(password || "");
    if (!normalizedEmail || !inputPassword) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    const genericError = NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    if (!user || !user.isActive) {
      logAdminAuditEvent({
        event: "login",
        status: "failure",
        email: normalizedEmail,
        route: "/api/admin/auth/login",
        reason: "missing_or_inactive_user",
      });
      return genericError;
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: "Account temporarily locked. Try again later." },
        { status: 423 },
      );
    }

    const isValid = await verifyAdminPassword(inputPassword, user.passwordHash);
    if (!isValid) {
      const failedLoginCount = user.failedLoginCount + 1;
      const shouldLock = failedLoginCount >= 5;

      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedLoginCount,
          lockedUntil: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      });

      logAdminAuditEvent({
        event: "login",
        status: "failure",
        userId: user.id,
        email: user.email,
        role: user.role,
        route: "/api/admin/auth/login",
        reason: "invalid_password",
      });
      return genericError;
    }

    const session = await createAdminSession({
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent"),
    });

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
    response.cookies.set(ADMIN_AUTH_COOKIE, session.token, getAdminCookieOptions());

    logAdminAuditEvent({
      event: "login",
      status: "success",
      userId: user.id,
      email: user.email,
      role: user.role,
      route: "/api/admin/auth/login",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
