-- CreateTable
CREATE TABLE "MetaborgBurnUsers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "MetaborgBurnUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetaborgBurnUsers_email_key" ON "MetaborgBurnUsers"("email");
