/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Artist_email_key" ON "Artist"("email");
