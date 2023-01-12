import { prismaClient } from "db-client";

export async function createTransactionOnDatabase(logs: []) {
  console.log("CREATING TRANSACTION(S) ON DATABASE START...");

  await prismaClient.transaction.createMany({
    data: logs,
  });

  console.log("CREATING TRANSACTION(S) ON DATABASE END...");
}

export async function updateTransactionsTimestampOnDatabase(
  transactions: {
    timestamp: number;
    logIndex: string;
  }[]
) {
  console.log("UPDATING TRANSACTION(S) ON DATABASE START...");

  await Promise.all(
    transactions?.map((t) =>
      prismaClient.transaction.update({
        where: { logIndex: t.logIndex },
        data: {
          timestamp: t.timestamp,
        },
      })
    )
  );

  console.log("UPDATING TRANSACTION(S) ON DATABASE END...");
}
