import { type TransferEventLog } from "@prisma/client";

import { prismaClient } from "db-client";

export async function createTransferEventLogsOnDatabase(
  transferEventLogs: TransferEventLog[]
) {
  console.log("CREATING TRANSFER EVENT LOGS ON DATABASE START...");

  const updatedDataForBurnGNft = transferEventLogs.map((transferEventLog) => {
    const logWithupdatedTimestamp = {
      ...transferEventLog,
      blockDate: new Date(Number(transferEventLog.timestamp)),
      timestamp: `${Number(transferEventLog.timestamp)}`,
    };

    return logWithupdatedTimestamp;
  });

  await prismaClient.transferEventLog.createMany({
    data: updatedDataForBurnGNft,
  });

  console.log("CREATING TRANSFER EVENT LOGS ON DATABASE END...");
}
