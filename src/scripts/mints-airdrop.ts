import keccak256 from "keccak256";
import fetch from "cross-fetch";
import { EventLog } from "@prisma/client";
import { utils } from "ethers";
import dotenv from "dotenv";

import { prismaClient } from "../db-client";
import { EMPTY_ADDRESS } from "../constants/token";
import ManifoldAbi from "../contracts/ManifoldAbi.json";

dotenv.config();

const ManifoldAbiInterface = new utils.Interface(ManifoldAbi);
const url = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const snapshotNumber = 1;

export const TRANSFER_EVENT_SIGNITURE = `0x${keccak256(
  "TransferSingle(address,address,address,uint256,uint256)"
).toString("hex")}`;

async function main() {
  await prismaClient.airdropUsers.deleteMany({
    where: { snapshotNumber },
  });

  const blockNoOnDB = await prismaClient.manifoldBlock.findFirst();

  const blockNoResponse = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_blockNumber",
    }),
  });
  const blockNumberJsonResponse = await blockNoResponse.json();
  const blockNumberOnChain = blockNumberJsonResponse?.result;

  const logsResponse = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getLogs",
      params: [
        {
          address: process.env.SC_MANIFOLD_ADDRESS,
          topics: [TRANSFER_EVENT_SIGNITURE],
          fromBlock: !!blockNoOnDB ? blockNoOnDB : "earliest",
          toBlock: !!blockNumberOnChain ? blockNumberOnChain : "latest",
        },
      ],
    }),
  });
  const logsJson = await logsResponse.json();
  const logs = (logsJson.result || []) as EventLog[];

  if (!!logs.length) {
    const mints = logs.filter((log) => {
      return log.topics[2] === EMPTY_ADDRESS;
    });

    const timestampRequests = [];
    for (let i = 0; i < mints.length; i++) {
      timestampRequests.push({
        id: i,
        method: "eth_getBlockByNumber",
        params: [mints[i].blockNumber, false],
        jsonrpc: "2.0",
      });
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timestampRequests),
    });

    const timestamps = await res.json();

    const mintsWithTimestamps = mints.map((mint, index) => ({
      ...mint,
      timestamp: timestamps[index].result["timestamp"],
    }));

    if (!!mintsWithTimestamps.length) {
      const formattedMints = mintsWithTimestamps.map((mint) => {
        const decodedInput = ManifoldAbiInterface.decodeEventLog(
          "TransferSingle",
          mint.data,
          mint.topics
        );

        return {
          address: decodedInput[2],
          amount: Number(decodedInput[4]),
          tokenId: Number(decodedInput[3]),
          provider: "Manifold",
          blockDate: new Date(Number(mint.timestamp) * 1000),
          timestamp: `${Number(mint.timestamp) * 1000}`,
          blockNumber: mint.blockNumber,
          snapshotNumber: 1,
        };
      });

      await prismaClient.airdropUsers.createMany({ data: formattedMints });
    }
  }

  if (!blockNoOnDB) {
    await prismaClient.manifoldBlock.create({
      data: { blockNo: `0x${(Number(blockNumberOnChain) + 1).toString(16)}` },
    });
  } else {
    await prismaClient.manifoldBlock.update({
      data: { blockNo: `0x${(Number(blockNumberOnChain) + 1).toString(16)}` },
      where: { id: blockNoOnDB.id },
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
