/*
  Warnings:

  - You are about to drop the column `verificationCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificationCode",
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpValidTime" TIMESTAMP(3);
