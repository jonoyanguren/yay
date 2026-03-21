-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "balance_invoice_sent_at" TIMESTAMP(3),
ADD COLUMN "balance_invoice_stripe_id" TEXT;
