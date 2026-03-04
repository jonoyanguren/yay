-- DropIndex
DROP INDEX "admin_users_role_idx";

-- AlterTable
ALTER TABLE "admin_users"
ADD COLUMN "singleton_key" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "role" SET DEFAULT 'SUPERADMIN';

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_singleton_key_key" ON "admin_users"("singleton_key");
