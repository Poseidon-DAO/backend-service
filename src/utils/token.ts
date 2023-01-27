import { type EventLog } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { ethers } from "ethers";

export function groupWeeklyTransferEventLogs(logs: EventLog[]) {
  let sum = 0;

  const groupedLogs = logs.reduce<Record<number, EventLog[]>>(
    (allGroupedLogs, currLog) => {
      const dayIndex = differenceInCalendarDays(new Date(), currLog.blockDate);

      sum +=
        currLog.functionName === "burnAndReceiveNFT"
          ? Number(currLog.data)
          : Number(ethers.utils.formatEther(currLog.data));

      const indexMap: Record<number, number> = {
        0: 7,
        1: 6,
        2: 5,
        3: 4,
        4: 3,
        5: 2,
        6: 1,
      };

      return {
        ...allGroupedLogs,
        [indexMap[dayIndex]]: [
          ...(allGroupedLogs[indexMap[dayIndex]] || []),
          currLog,
        ],
      };
    },
    { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }
  );

  return {
    groupedLogs,
    sum,
  };
}

export function groupAirdropsByDate(logs: EventLog[]) {
  const groupedLogs = logs.reduce<Record<string, EventLog[]>>(
    (allGroupedLogs, currTransfer) => {
      return {
        ...allGroupedLogs,
        [currTransfer.timestamp]: [
          ...(allGroupedLogs[currTransfer.timestamp] || []),
          currTransfer,
        ],
      };
    },
    {}
  );

  const keys = Object.keys(groupedLogs);
  const lastFiveKeys = keys.slice(Math.max(keys.length - 5, 1));

  const lastFiveObject = lastFiveKeys.reduce<Record<string, EventLog[]>>(
    (acc, key) => {
      acc[key] = groupedLogs[key];

      return acc;
    },
    {}
  );

  return {
    groupedLogs: lastFiveObject,
  };
}
