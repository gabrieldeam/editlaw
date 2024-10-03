/*
  Warnings:

  - You are about to drop the `CreditCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentCardId" TEXT,
ADD COLUMN     "paymentCustomerId" TEXT;

-- DropTable
DROP TABLE "CreditCard";
