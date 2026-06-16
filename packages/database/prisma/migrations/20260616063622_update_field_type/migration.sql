/*
  Warnings:

  - The values [DATE,CHECKBOX,RADIO] on the enum `FormFieldType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CreditTransactionType" ADD VALUE 'RESERVE';
ALTER TYPE "CreditTransactionType" ADD VALUE 'REFUND';

-- AlterEnum
BEGIN;
CREATE TYPE "FormFieldType_new" AS ENUM ('TEXT', 'LONG_TEXT', 'NUMBER', 'EMAIL', 'DROPDOWN');
ALTER TABLE "FormField" ALTER COLUMN "type" TYPE "FormFieldType_new" USING ("type"::text::"FormFieldType_new");
ALTER TYPE "FormFieldType" RENAME TO "FormFieldType_old";
ALTER TYPE "FormFieldType_new" RENAME TO "FormFieldType";
DROP TYPE "public"."FormFieldType_old";
COMMIT;
