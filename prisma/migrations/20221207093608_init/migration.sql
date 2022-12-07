-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "hex" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_hex_key" ON "Poll"("hex");
