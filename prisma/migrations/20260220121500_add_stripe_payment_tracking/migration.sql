-- AlterTable
ALTER TABLE "bookings"
ADD COLUMN "stripe_customer_id" TEXT,
ADD COLUMN "stripe_amount_total_cents" INTEGER,
ADD COLUMN "stripe_payment_type" TEXT;
