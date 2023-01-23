import { type TransferEventLog } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";

export function groupWeeklyMintedNFTLogs(
  logs: TransferEventLog[],
  ratio: number
) {
  let sum = 0;

  const groupedLogs = logs.reduce<
    Record<number, (TransferEventLog & { gNft: number })[]>
  >(
    (allGroupedLogs, currTransfer) => {
      const dayIndex = differenceInCalendarDays(
        new Date(),
        currTransfer.blockDate
      );

      let gNft = Number(currTransfer.data) / ratio;

      sum += gNft;

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
          { ...currTransfer, gNft },
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
