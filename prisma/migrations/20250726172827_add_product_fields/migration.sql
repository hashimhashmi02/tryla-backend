/*
  Warnings:

  - You are about to drop the column `updaredAt` on the `Product` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "updaredAt",
ADD COLUMN     "availability" "Availability" NOT NULL DEFAULT 'IN_STOCK',
ADD COLUMN     "careInstructions" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "fit" TEXT,
ADD COLUMN     "length" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "sizes" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
