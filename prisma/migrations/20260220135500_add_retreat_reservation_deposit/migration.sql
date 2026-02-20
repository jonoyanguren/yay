-- AlterTable
ALTER TABLE "retreats"
ADD COLUMN "reservation_deposit_cents" INTEGER NOT NULL DEFAULT 60000;
