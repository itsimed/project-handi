-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('ACTIVE', 'PAUSED');

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN "status" "OfferStatus" NOT NULL DEFAULT 'ACTIVE';
