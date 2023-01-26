import { type EventLog } from "@prisma/client";

import { createBlockNo, getBlockNo, updateBlockNo } from "./db/block.crud";
import { createEventLogs } from "./db/eventLog.crud";

import { getMostRecentBlock } from "./chain/getMostRecentBlockNumber";
import { getTransferEventLogs } from "./chain/getTransferEventLogs";
import { getTimeStampForBlock } from "./chain/getTimestampForBlock";
import { getAddVestEventLogs } from "./chain/getAddVestEventLogs";

async function eventLogsFetcher() {
  console.log("READING EVENT LOGS START...");

  try {
    const blockNoOnDatabase = await getBlockNo();
    const blockNoOnChain = await getMostRecentBlock();

    const transferEventLogs = await getTransferEventLogs(
      blockNoOnDatabase?.blockNo,
      blockNoOnChain
    );

    const addVestEventLogs = await getAddVestEventLogs(
      blockNoOnDatabase?.blockNo,
      blockNoOnChain
    );

    const combinedLogs = [...transferEventLogs, ...addVestEventLogs];

    if (!blockNoOnDatabase) {
      await createBlockNo(blockNoOnChain);
    } else {
      await updateBlockNo(blockNoOnDatabase?.id, blockNoOnChain);
    }

    if (!!combinedLogs?.length) {
      const logsWithTimestamps = await Promise.all(
        combinedLogs?.map((log: EventLog) => getTimeStampForBlock(log))
      );

      await createEventLogs(logsWithTimestamps);
    }

    console.log("READING EVENT LOGS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { eventLogsFetcher };
