/*
  Warnings:

  - Added the required column `country` to the `MetaborgBurnUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MetaborgBurnUsers" ADD COLUMN     "country" TEXT NOT NULL;
