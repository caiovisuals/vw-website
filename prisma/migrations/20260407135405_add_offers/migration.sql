-- CreateEnum
CREATE TYPE "OfferCategory" AS ENUM ('hatch', 'suv', 'sedan', 'picape');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('novo', 'seminovo');

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "category" "OfferCategory" NOT NULL,
    "model" TEXT NOT NULL,
    "type" "OfferType" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2),
    "imageUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validUntil" TIMESTAMP(3),
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);
