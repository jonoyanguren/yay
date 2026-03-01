-- Optional text highlights per retreat text field
ALTER TABLE "retreats"
ADD COLUMN "text_highlights" JSONB;
