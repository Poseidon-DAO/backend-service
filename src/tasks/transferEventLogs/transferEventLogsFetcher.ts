import { type TransferEventLog } from "@prisma/client";

import { createBlockNo, getBlockNo, updateBlockNo } from "./db/block.crud";
import { createTransferEventLogs } from "./db/transferEventLog.crud";

import { getMostRecentBlock } from "./chain/getMostRecentBlockNumber";
import { getTransferEventLogs } from "./chain/getTransferEventLogs";
import { getTimeStampForBlock } from "./chain/getTimestampForBlock";

async function transferEventLogsFetcher() {
  console.log("READING TRANSFER EVENT LOGS START...");

  try {
    const blockNoOnDatabase = await getBlockNo();
    const blockNoOnChain = await getMostRecentBlock();

    const transferEventLogs = await getTransferEventLogs(
      blockNoOnDatabase?.blockNo,
      blockNoOnChain
    );

    if (!blockNoOnDatabase) {
      await createBlockNo(blockNoOnChain);
    } else {
      await updateBlockNo(blockNoOnDatabase?.id, blockNoOnChain);
    }

    if (!!transferEventLogs?.length) {
      const transferEventLogsWithTimestamps = await Promise.all(
        transferEventLogs?.map((log: TransferEventLog) =>
          getTimeStampForBlock(log)
        )
      );

      await createTransferEventLogs(transferEventLogsWithTimestamps);
    }

    console.log("READING TRANSFER EVENT LOGS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { transferEventLogsFetcher };
