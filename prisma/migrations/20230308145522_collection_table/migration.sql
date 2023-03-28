
-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "platformAddress" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tokenUriRaw" TEXT NOT NULL,
    "tokenUriGateway" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "yearCreated" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "mimeUri" TEXT NOT NULL,
    "tags" TEXT[],
    "timeLastUpdated" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_id_key" ON "Collection"("id");
