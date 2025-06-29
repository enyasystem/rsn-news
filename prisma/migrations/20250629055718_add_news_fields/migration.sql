-- AlterTable
ALTER TABLE "News" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT,
ADD COLUMN     "sourceUrl" TEXT;
