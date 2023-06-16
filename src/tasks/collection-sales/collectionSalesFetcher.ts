import { utils } from "ethers";
import { alchemySDK } from "@sdk/index";
import { TRANSFER_EVENT_SIGNITURE } from "@tasks/eventLogs/constants";
import { prismaClient } from "db-client";

const platforms = {
  [process.env.SC_SUPERRARE!]: "SuperRare",
};

async function collectionSalesFetcher() {
  console.log("READING COLLECTION SALES START...");

  try {
    const currentBlock = await alchemySDK.core.getBlockNumber();
    const thirtyDaysAgoBlock = currentBlock - 172800; // Approximate number of blocks for 30 days
    const blockSize = 5760 * 5; // Approximate number of blocks for 5 days.

    for (
      let fromBlock = currentBlock;
      fromBlock > thirtyDaysAgoBlock;
      fromBlock -= blockSize
    ) {
      const toBlock = Math.min(fromBlock + blockSize, currentBlock);

      const logsFrom = await alchemySDK.core.getLogs({
        fromBlock,
        toBlock,
        address: process.env.SC_SUPERRARE,
        topics: [
          TRANSFER_EVENT_SIGNITURE,
          utils.hexZeroPad(
            utils.getAddress(process.env.SC_PDN_ON_SUPERRARE!),
            32
          ),
        ],
      });

      const logsTo = await alchemySDK.core.getLogs({
        fromBlock,
        toBlock,
        address: process.env.SC_SUPERRARE,
        topics: [
          TRANSFER_EVENT_SIGNITURE,
          null,
          utils.hexZeroPad(
            utils.getAddress(process.env.SC_PDN_ON_SUPERRARE!),
            32
          ),
        ],
      });

      for (const log of [...logsFrom, ...logsTo]) {
        console.log(
          "loopinggg",
          "iteration" + fromBlock / blockSize,
          [...logsFrom, ...logsTo].length,
          log.transactionHash
        );
        const { transactionHash, address, topics, blockNumber } = log;

        const tokenId = logsFrom.includes(log) ? topics[2] : topics[1];
        const block = await alchemySDK.core.getBlock(blockNumber);
        const transactionType: string = logsFrom.includes(log) ? "sell" : "buy";
        const timestamp = block.timestamp;
        const platform = platforms[log.address.toLowerCase()];

        console.log("creating/updating");

        await prismaClient.collectionSales.upsert({
          where: {
            contractAddress_tokenId: {
              contractAddress: address.toLowerCase(),
              tokenId,
            },
          },
          create: {
            contractAddress: address.toLowerCase(),
            tokenId,
            transactionHash,
            transactionType,
            timestamp: new Date(timestamp * 1000),
            platform,
          },
          update: {
            contractAddress: address.toLowerCase(),
            tokenId,
            transactionHash,
            transactionType,
            timestamp: new Date(timestamp * 1000),
            platform,
          },
        });
      }
    }

    console.log("READING COLLECTION SALES END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { collectionSalesFetcher };
