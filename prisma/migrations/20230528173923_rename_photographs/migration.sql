/*
  Warnings:

  - You are about to drop the `Photograph` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Photograph";

-- CreateTable
CREATE TABLE "Artwork" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrls" TEXT[],
    "category" TEXT NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);
