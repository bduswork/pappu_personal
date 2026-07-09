-- AlterEnum
ALTER TYPE "MediaProvider" ADD VALUE 'DATABASE';

-- AlterTable
ALTER TABLE "media_assets" ADD COLUMN     "data" BYTEA,
ADD COLUMN     "mimeType" TEXT,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "provider" SET DEFAULT 'DATABASE';
