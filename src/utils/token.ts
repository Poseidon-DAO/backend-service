import { type TransferEventLog } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { ethers } from "ethers";

export function groupWeeklyTransferEventLogs(logs: TransferEventLog[]) {
  let sum = 0;

  const groupedLogs = logs.reduce<Record<number, TransferEventLog[]>>(
    (allGroupedLogs, currTransfer) => {
      const dayIndex = differenceInCalendarDays(
        new Date(),
        currTransfer.blockDate
      );

      sum +=
        currTransfer.functionName === "burnAndReceiveNFT"
          ? Number(currTransfer.data)
          : Number(ethers.utils.formatEther(currTransfer.data));

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
          currTransfer,
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
