/*
  Warnings:

  - Added the required column `phone` to the `MetaborgBurnUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `MetaborgBurnUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `MetaborgBurnUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MetaborgBurnUsers" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;
