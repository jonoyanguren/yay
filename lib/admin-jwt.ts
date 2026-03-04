import { AdminRole } from "@prisma/client";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

export const ADMIN_AUTH_COOKIE = "admin_session";
const ADMIN_TOKEN_TTL_SECONDS = 60 * 60 * 8;

export interface AdminJwtPayload extends JWTPayload {
  sub: string;
  role: AdminRole;
  tv: number;
  sid: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is missing");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminTokenTtlSeconds() {
  return ADMIN_TOKEN_TTL_SECONDS;
}

export async function signAdminJwt(input: {
  userId: string;
  role: AdminRole;
  tokenVersion: number;
  sessionId: string;
}) {
  return await new SignJWT({
    role: input.role,
    tv: input.tokenVersion,
    sid: input.sessionId,
  } satisfies Omit<AdminJwtPayload, "sub">)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TOKEN_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminJwt(token: string) {
  const { payload } = await jwtVerify<AdminJwtPayload>(token, getSecretKey(), {
    algorithms: ["HS256"],
  });

  if (!payload.sub || !payload.sid || payload.tv == null || !payload.role) {
    throw new Error("Invalid JWT payload");
  }

  return payload;
}
