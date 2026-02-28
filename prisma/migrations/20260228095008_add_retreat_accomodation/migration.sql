-- AlterTable
ALTER TABLE "retreats" ADD COLUMN     "accommodation_description" TEXT,
ADD COLUMN     "accommodation_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "accommodation_title" TEXT;
