import { type EventLog } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";

export function groupWeeklyMintedNFTLogs(logs: EventLog[], ratio: number) {
  let sum = 0;

  const groupedLogs = logs.reduce<
    Record<number, (EventLog & { gNft: number })[]>
  >(
    (allGroupedLogs, currLog) => {
      const dayIndex = differenceInCalendarDays(new Date(), currLog.blockDate);

      let gNft = Number(currLog.data) / ratio;

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
          { ...currLog, gNft },
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
