ALTER TABLE "retreat_room_types"
ADD COLUMN "max_people" INTEGER NOT NULL DEFAULT 1;

UPDATE "retreat_room_types"
SET "max_people" = "max_quantity";

UPDATE "retreats" r
SET "max_people" = t.total_max_people
FROM (
  SELECT "retreat_id", COALESCE(SUM("max_people"), 0) AS total_max_people
  FROM "retreat_room_types"
  GROUP BY "retreat_id"
) t
WHERE r."id" = t."retreat_id";
