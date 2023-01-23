import { type TransferEventLog } from "@prisma/client";

import {
  createBlockNoOnDatabase,
  getBlockNoOnDatabase,
  updateBlockNoOnDatabase,
} from "./db/block.crud";
import { createTransferEventLogsOnDatabase } from "./db/transferEventLog.crud";

import { getBlockNoOnChain } from "./chain/getMostRecentBlockNumber";
import { getTransferEventLogs } from "./chain/getTransferEventLogs";
import { getTimeStampForBlock } from "./chain/getTimestampForBlock";

async function transferEventLogsFetcher() {
  console.log("READING TRANSFER EVENT LOGS START...");

  try {
    const blockNoOnDatabase = await getBlockNoOnDatabase();
    const blockNoOnChain = await getBlockNoOnChain();

    const transferEventLogs = await getTransferEventLogs(
      blockNoOnDatabase?.blockNo,
      blockNoOnChain
    );

    if (!blockNoOnDatabase) {
      await createBlockNoOnDatabase(blockNoOnChain);
    } else {
      await updateBlockNoOnDatabase(blockNoOnDatabase?.id, blockNoOnChain);
    }

    if (!!transferEventLogs?.length) {
      const transferEventLogsWithTimestamps = await Promise.all(
        transferEventLogs?.map((log: TransferEventLog) =>
          getTimeStampForBlock(log)
        )
      );

      await createTransferEventLogsOnDatabase(transferEventLogsWithTimestamps);
    }

    console.log("READING TRANSFER EVENT LOGS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { transferEventLogsFetcher };
