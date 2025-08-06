/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentIntentId",
ADD COLUMN     "recipientName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recipientPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddress" TEXT NOT NULL DEFAULT '';
