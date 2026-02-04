-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasCompletedTest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[];
