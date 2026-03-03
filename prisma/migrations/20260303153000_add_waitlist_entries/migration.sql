CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL,
    "retreat_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "waitlist_entries_status_idx" ON "waitlist_entries"("status");
CREATE INDEX "waitlist_entries_created_at_idx" ON "waitlist_entries"("created_at");
CREATE UNIQUE INDEX "waitlist_entries_retreat_id_email_key" ON "waitlist_entries"("retreat_id", "email");

ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_retreat_id_fkey" FOREIGN KEY ("retreat_id") REFERENCES "retreats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
