import { type Transfer, type Burn } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { ethers } from "ethers";

export function groupedTransactionsByDiffInDays(data: (Burn | Transfer)[]) {
  let sum = 0;

  const grouped = data.reduce<Record<number, (Burn | Transfer)[]>>(
    (groupedTransfers, currTransfer) => {
      const dayIndex = differenceInDays(new Date(), currTransfer.blockDate);
      sum += Number(ethers.utils.formatEther(currTransfer.data));

      return {
        ...groupedTransfers,
        [dayIndex]: [...(groupedTransfers[dayIndex] || []), currTransfer],
      };
    },
    {}
  );

  return {
    grouped,
    sum,
  };
}
