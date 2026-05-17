/*
  Warnings:

  - Made the column `date` on table `Diary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Diary" ALTER COLUMN "date" SET NOT NULL;
