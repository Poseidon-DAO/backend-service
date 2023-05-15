import keccak256 from "keccak256";
import fetch from "cross-fetch";
import { type EventLog } from "@prisma/client";
import { utils } from "ethers";
import dotenv from "dotenv";

import { prismaClient } from "../db-client";
import { EMPTY_ADDRESS } from "../constants/token";
import ERC1155Abi from "../contracts/ERC1155Abi.json";

dotenv.config();

const mainnetBaseUrl = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const goerliBaseUrl = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;

const urlMap: Record<string, string> = {
  "0x1": mainnetBaseUrl,
  "0x5": goerliBaseUrl,
};
const url = urlMap[process.env.CHAIN_ID!];

const ERC1155Interface = new utils.Interface(ERC1155Abi);

const TRANSFER_EVENT_SIGNITURE = `0x${keccak256(
  "TransferSingle(address,address,address,uint256,uint256)"
).toString("hex")}`;

async function main() {
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
          address: process.env.SC_ERC1155_ADDRESS,
          topics: [TRANSFER_EVENT_SIGNITURE, null, EMPTY_ADDRESS],
          fromBlock: "earliest",
          toBlock: "latest",
        },
      ],
    }),
  });
  const logsJson = await logsResponse.json();
  const logs = (logsJson.result || []) as EventLog[];

  if (!!logs.length) {
    const timestampRequests = [];

    for (let i = 0; i < logs.length; i++) {
      timestampRequests.push({
        id: i,
        method: "eth_getBlockByNumber",
        params: [logs[i].blockNumber, false],
        jsonrpc: "2.0",
      });
    }

    const timestampsResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timestampRequests),
    });

    const timestamps = await timestampsResponse.json();

    const mintsWithTimestamps = logs.map((mint, index) => ({
      ...mint,
      timestamp: timestamps[index].result["timestamp"],
    }));

    if (!!mintsWithTimestamps.length) {
      for (let i = 0; i < mintsWithTimestamps.length; i++) {
        const mint = mintsWithTimestamps[i];

        const decodedInput = ERC1155Interface.decodeEventLog(
          "TransferSingle",
          mint.data,
          mint.topics
        );

        const userAddress = decodedInput.to;

        const user = await prismaClient.user.findUnique({
          where: { address: userAddress },
        });

        if (!user) {
          await prismaClient.user.create({
            data: {
              address: decodedInput.to,
              gNfts: BigInt(decodedInput.value).toString(),
              isGuardian: true,
              createdAt: new Date(Number(mint.timestamp) * 1000),
            },
          });
        } else {
          await prismaClient.user.update({
            where: { id: user?.id },
            data: {
              gNfts: (
                BigInt(user.gNfts) + BigInt(decodedInput.value)
              ).toString(),
              isGuardian: true,
            },
          });
        }
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
