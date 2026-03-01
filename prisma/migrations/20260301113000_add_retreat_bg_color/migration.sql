-- Add background color field for retreat themed sections/waves
ALTER TABLE "retreats"
ADD COLUMN "bg_color" TEXT;

-- Set Sahara Calm chosen color
UPDATE "retreats"
SET "bg_color" = '#d77a61'
WHERE lower("slug") = 'sahara-calm'
   OR lower("title") = 'sahara calm';
