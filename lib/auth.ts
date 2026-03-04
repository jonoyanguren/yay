import { AdminRole } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { ADMIN_AUTH_COOKIE, getAdminTokenTtlSeconds, signAdminJwt, verifyAdminJwt } from "@/lib/admin-jwt";
import { prisma } from "@/lib/prisma";

export type AdminPermission =
  | "retreats:read"
  | "retreats:write"
  | "bookings:read"
  | "bookings:write"
  | "waitlist:read"
  | "waitlist:write"
  | "media:delete";

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  SUPERADMIN: [
    "retreats:read",
    "retreats:write",
    "bookings:read",
    "bookings:write",
    "waitlist:read",
    "waitlist:write",
    "media:delete",
  ],
  EDITOR: ["retreats:read", "retreats:write", "bookings:read", "waitlist:read"],
  SUPPORT: ["bookings:read", "bookings:write", "waitlist:read", "waitlist:write"],
};

export interface AdminAuthContext {
  userId: string;
  email: string;
  role: AdminRole;
  permissions: Set<AdminPermission>;
  sessionId: string;
}

function authJsonError(status = 401, message = "Unauthorized") {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
}

export function getAdminPermissions(role: AdminRole): AdminPermission[] {
  return rolePermissions[role] ?? [];
}

export async function hashAdminPassword(plainPassword: string) {
  return await hash(plainPassword, 12);
}

export async function verifyAdminPassword(plainPassword: string, passwordHash: string) {
  return await compare(plainPassword, passwordHash);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: getAdminTokenTtlSeconds(),
  };
}

export async function createAdminSession(input: {
  userId: string;
  role: AdminRole;
  tokenVersion: number;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const expiresAt = new Date(Date.now() + getAdminTokenTtlSeconds() * 1000);
  const session = await prisma.adminSession.create({
    data: {
      userId: input.userId,
      tokenId: crypto.randomUUID(),
      expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });

  const token = await signAdminJwt({
    userId: input.userId,
    role: input.role,
    tokenVersion: input.tokenVersion,
    sessionId: session.tokenId,
  });

  return { token, tokenId: session.tokenId, expiresAt };
}

export async function revokeAdminSessionByTokenId(tokenId: string) {
  await prisma.adminSession.updateMany({
    where: { tokenId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllAdminSessions(userId: string) {
  await prisma.adminSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function requireAdminAuth(
  request: Request,
  requiredPermission?: AdminPermission,
): Promise<AdminAuthContext | Response> {
  try {
    const token = parseCookies(request.headers.get("cookie"))[ADMIN_AUTH_COOKIE];
    if (!token) return authJsonError();

    const payload = await verifyAdminJwt(token);
    const userId = payload.sub;
    const tokenId = payload.sid;
    const tokenVersion = Number(payload.tv);
    if (!userId || !tokenId || Number.isNaN(tokenVersion)) return authJsonError();

    const [user, session] = await Promise.all([
      prisma.adminUser.findUnique({ where: { id: userId } }),
      prisma.adminSession.findUnique({ where: { tokenId } }),
    ]);

    if (!user || !user.isActive || user.tokenVersion !== tokenVersion) return authJsonError();
    if (!session || session.revokedAt || session.expiresAt <= new Date() || session.userId !== user.id) {
      return authJsonError();
    }

    const permissions = new Set(getAdminPermissions(user.role));
    if (requiredPermission && !permissions.has(requiredPermission)) {
      return authJsonError(403, "Forbidden");
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions,
      sessionId: session.tokenId,
    };
  } catch {
    return authJsonError();
  }
}
