import { prisma } from "../lib/prisma";
import { hashAdminPassword, revokeAllAdminSessions } from "../lib/auth";

function getEnvValue(key: string): string {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value.trim();
}

async function main() {
  const email = getEnvValue("ADMIN_EMAIL").toLowerCase();
  const password = getEnvValue("ADMIN_PASSWORD");

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const passwordHash = await hashAdminPassword(password);

  const user = await prisma.adminUser.upsert({
    where: { singletonKey: 1 },
    create: {
      singletonKey: 1,
      email,
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
      passwordChangedAt: new Date(),
    },
    update: {
      email,
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
      tokenVersion: { increment: 1 },
      passwordChangedAt: new Date(),
      failedLoginCount: 0,
      lockedUntil: null,
    },
  });

  await revokeAllAdminSessions(user.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
