import { type Burn } from "@prisma/client";
import { prismaClient } from "db-client";

export async function createBurnsLogsOnDatabase(logs: Burn[]) {
  console.log("CREATING BURN(S) ON DATABASE START...");

  await prismaClient.burn.createMany({
    data: logs,
  });

  console.log("CREATING BURN(S) ON DATABASE END...");
}

export async function updateBurnsTimestampsOnDatabase(
  transactions: {
    timestamp: string;
    logIndex: string;
  }[]
) {
  console.log("UPDATING BURN(S) ON DATABASE START...");

  await Promise.all(
    transactions?.map((t) =>
      prismaClient.burn.update({
        where: { logIndex: t.logIndex },
        data: {
          blockDate: new Date(Number(t.timestamp)),
          timestamp: `${Number(t.timestamp)}`,
        },
      })
    )
  );

  console.log("UPDATING BURN(S) ON DATABASE END...");
}
