-- Add manual sorting support for retreats in admin/web.
ALTER TABLE "retreats"
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- Backfill deterministic order for existing records.
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS position
  FROM retreats
)
UPDATE retreats r
SET sort_order = o.position
FROM ordered o
WHERE r.id = o.id;
