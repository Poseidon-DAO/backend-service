import { type EventLog } from "@prisma/client";

import { prismaClient } from "db-client";

export async function createEventLogs(eventLogs: EventLog[]) {
  console.log("CREATING EVENT LOGS ON DATABASE START...");

  const logsWithupdatedTimestamps = eventLogs.map((eventLog) => {
    return {
      ...eventLog,
      blockDate: new Date(Number(eventLog.timestamp)),
      timestamp: `${Number(eventLog.timestamp)}`,
    };
  });

  await prismaClient.eventLog.createMany({ data: logsWithupdatedTimestamps });

  console.log("CREATING EVENT LOGS ON DATABASE END...");
}
