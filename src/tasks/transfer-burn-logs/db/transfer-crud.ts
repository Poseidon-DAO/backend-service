import { type Transfer } from "@prisma/client";
import { prismaClient } from "db-client";

export async function createTransferLogsOnDatabase(logs: Transfer[]) {
  console.log("CREATING TRANSACTION(S) ON DATABASE START...");

  await prismaClient.transfer.createMany({
    data: logs,
  });

  console.log("CREATING TRANSACTION(S) ON DATABASE END...");
}

export async function updateTransfersTimestampsOnDatabase(
  transactions: {
    timestamp: string;
    logIndex: string;
  }[]
) {
  console.log("UPDATING TRANSFER(S) ON DATABASE START...");

  await Promise.all(
    transactions?.map((t) =>
      prismaClient.transfer.update({
        where: { logIndex: t.logIndex },
        data: {
          blockDate: new Date(Number(t.timestamp)),
          timestamp: `${Number(t.timestamp)}`,
        },
      })
    )
  );

  console.log("UPDATING TRANSFER(S) ON DATABASE END...");
}
