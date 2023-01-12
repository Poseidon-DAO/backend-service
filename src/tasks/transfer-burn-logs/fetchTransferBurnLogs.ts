import { type Transfer, type Burn } from "@prisma/client";
import { EMPTY_ADDRESS } from "@constants/token";

import {
  createBlockOnDatabase,
  getBlockOnDatabase,
  updateBlockOnDatabase,
} from "./db/block-crud";
import {
  createTransferLogsOnDatabase,
  updateTransfersTimestampsOnDatabase,
} from "./db/transfer-crud";
import {
  createBurnsLogsOnDatabase,
  updateBurnsTimestampsOnDatabase,
} from "./db/burn-crud";

import { getBlockOnChain } from "./chain/getMostRecentBlockNumber";
import { getTransferBurnEventLogs } from "./chain/getTransferBurnEventLogs";
import { getTimeStampForBlock } from "./chain/getTimestampForBlock";

async function fetchTransferBurnLogs() {
  console.log("FETCHING TRANSFER(S)/BURN(S) LOGS START...");

  try {
    const blockNoOnDatabase = await getBlockOnDatabase();
    const blockNoOnChain = await getBlockOnChain();

    const transferBurnLogs = await getTransferBurnEventLogs(
      blockNoOnDatabase?.blockNo,
      blockNoOnChain
    );

    const { transfers, burns } = (transferBurnLogs || []).reduce<{
      transfers: Transfer[];
      burns: Burn[];
    }>(
      (transferAndBurns, currentTransfer) => {
        if (currentTransfer.topics[2] === EMPTY_ADDRESS) {
          transferAndBurns.burns.push(currentTransfer);
        } else {
          transferAndBurns.transfers.push(currentTransfer);
        }

        return transferAndBurns;
      },
      {
        transfers: [],
        burns: [],
      }
    );

    if (!blockNoOnDatabase) {
      await createBlockOnDatabase(blockNoOnChain);
    } else {
      await updateBlockOnDatabase(blockNoOnDatabase?.id, blockNoOnChain);
    }

    if (!!transfers?.length) {
      await createTransferLogsOnDatabase(transfers);
      const timestapsForTransfers = await Promise.all(
        transfers.map((log: Transfer) =>
          getTimeStampForBlock(log?.blockNumber, log?.logIndex)
        )
      );
      await updateTransfersTimestampsOnDatabase(timestapsForTransfers);
    }

    if (!!burns?.length) {
      await createBurnsLogsOnDatabase(burns);
      const timestapsForBurns = await Promise.all(
        burns.map((log: Burn) =>
          getTimeStampForBlock(log?.blockNumber, log?.logIndex)
        )
      );
      await updateBurnsTimestampsOnDatabase(timestapsForBurns);
    }

    console.log("FETCHING TRANSFER(S)/BURN(S) LOGS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { fetchTransferBurnLogs };
