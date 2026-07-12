-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('NEW', 'CONTACTED', 'ENROLLED');

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "message" TEXT,
    "programSlug" TEXT,
    "programName" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enrollments_createdAt_idx" ON "enrollments"("createdAt");
