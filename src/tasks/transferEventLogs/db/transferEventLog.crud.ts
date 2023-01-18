import { type TransferEventLog } from "@prisma/client";

import { prismaClient } from "db-client";
import { ethers } from "ethers";

export async function createTransferEventLogsOnDatabase(
  transferEventLogs: TransferEventLog[]
) {
  console.log("CREATING TRANSFER EVENT LOGS ON DATABASE START...");

  const updatedDataForBurnGNft = transferEventLogs.map((transferEventLog) => {
    if (transferEventLog.functionName === "burnAndReceiveNFT") {
      return {
        ...transferEventLog,
        data: ethers.utils
          .parseUnits(Number(transferEventLog.data).toString(), 18)
          .toString(),
      };
    }

    return transferEventLog;
  });

  await prismaClient.transferEventLog.createMany({
    data: updatedDataForBurnGNft,
  });

  console.log("CREATING TRANSFER EVENT LOGS ON DATABASE END...");
}

export async function updateTransferEventLogsTimestampsOnDatabase(
  transferEventLogs: TransferEventLog[]
) {
  console.log("UPDATING TRANSFER EVENT LOGS ON DATABASE START...");

  await Promise.all(
    transferEventLogs?.map((log) =>
      prismaClient.transferEventLog.update({
        where: { logIndex: log.logIndex },
        data: {
          blockDate: new Date(Number(log.timestamp)),
          timestamp: `${Number(log.timestamp)}`,
        },
      })
    )
  );

  console.log("UPDATING TRANSFER EVENT LOGS ON DATABASE END...");
}
