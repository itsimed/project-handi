/*
  Warnings:

  - Changed the column `contract` on the `Offer` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable: Transformer contract en tableau en conservant les valeurs existantes
ALTER TABLE "Offer" ALTER COLUMN "contract" SET DATA TYPE "ContractType"[] USING ARRAY[contract]::"ContractType"[];
