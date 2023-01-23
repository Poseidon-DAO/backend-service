-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "hex" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "blockNo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferEventLog" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "topics" TEXT[],
    "data" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionIndex" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "logIndex" TEXT NOT NULL,
    "removed" BOOLEAN NOT NULL,
    "blockDate" TIMESTAMPTZ(3) NOT NULL,
    "timestamp" TEXT NOT NULL,
    "functionName" TEXT,

    CONSTRAINT "TransferEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_hex_key" ON "Poll"("hex");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockNo_key" ON "Block"("blockNo");

-- CreateIndex
CREATE UNIQUE INDEX "TransferEventLog_id_key" ON "TransferEventLog"("id");
