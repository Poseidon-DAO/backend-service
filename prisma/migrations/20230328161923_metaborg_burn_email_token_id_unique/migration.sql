/*
  Warnings:

  - A unique constraint covering the columns `[email,tokenId]` on the table `MetaborgBurnUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MetaborgBurnUsers_email_key";

-- CreateIndex
CREATE INDEX "MetaborgBurnUsers_email_tokenId_idx" ON "MetaborgBurnUsers"("email", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaborgBurnUsers_email_tokenId_key" ON "MetaborgBurnUsers"("email", "tokenId");
