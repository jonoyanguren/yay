-- AlterTable
ALTER TABLE "retreat_extra_activities" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "retreat_room_types" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "retreats" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing image data to images array for retreats
UPDATE "retreats" 
SET "images" = CASE 
  WHEN "image" != '' THEN ARRAY["image"]::TEXT[]
  ELSE ARRAY[]::TEXT[]
END;
