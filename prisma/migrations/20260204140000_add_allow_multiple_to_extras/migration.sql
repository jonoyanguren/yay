-- AlterTable
ALTER TABLE "retreat_extra_activities" ADD COLUMN IF NOT EXISTS "allow_multiple" BOOLEAN NOT NULL DEFAULT true;
