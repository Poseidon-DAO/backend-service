import { type Transaction } from "@prisma/client";

import {
  createBlockOnDatabase,
  getBlockOnDatabase,
  updateBlockOnDatabase,
} from "./db/block-crud";
import {
  createTransactionOnDatabase,
  updateTransactionsTimestampOnDatabase,
} from "./db/transactions-crud";

import { getMostRecentBlockNo } from "./chain/getMostRecentBlockNumber";
import { getTransferEventLogs } from "./chain/getTransferEventLogs";
import { getTimeStampForBlock } from "./chain/getTimestampForBlock";

async function fetchLogs() {
  console.log("FETCHING TRANSFER LOGS START...");

  try {
    const blockNoOnDatabase = await getBlockOnDatabase();
    const blockNoOnChain = await getMostRecentBlockNo();

    if (!blockNoOnDatabase) {
      await createBlockOnDatabase(blockNoOnChain);
    } else {
      await updateBlockOnDatabase(blockNoOnDatabase?.id, blockNoOnChain);
    }

    const logs = await getTransferEventLogs(blockNoOnDatabase?.blockNo);

    if (!!logs?.length) {
      await createTransactionOnDatabase(logs);

      const values = await Promise.all(
        logs.map((log: Transaction) =>
          getTimeStampForBlock(log?.blockNumber, log?.logIndex)
        )
      );

      await updateTransactionsTimestampOnDatabase(values);
    }

    console.log("FETCHING TRANSFER LOGS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { fetchLogs };
