import { type EventLog } from "@prisma/client";
import fetch from "cross-fetch";

import { getBaseUrl } from "@constants/alchemy-url";

export async function getTimeStampForBlock(
  log: EventLog,
  retries: number = 5
): Promise<EventLog> {
  console.log(
    `READING BLOCK ${log.blockNumber} INFORMATION FROM CHAIN START...`
  );

  const blockInfoResponse = await fetch(getBaseUrl(), {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [log.blockNumber, false],
    }),
  });
  const blockInfoJsonResponse = await blockInfoResponse.json();
  const blockInfoOnChain = blockInfoJsonResponse?.result;

  console.log(`READING BLOCK ${log.blockNumber} INFORMATION FROM CHAIN END...`);

  if (!blockInfoOnChain?.timestamp && retries > 0) {
    console.log("TIMESTAMP NOT FOUND. RETRYING...");
    return getTimeStampForBlock(log, retries - 1);
  }

  if (retries === 0 && !blockInfoOnChain?.timestamp) {
    throw new Error(
      `FAILED TO FETCH TIMESTAMP FOR BLOCK ${log.blockNumber} AFTER ${retries} RETRIES.`
    );
  }

  return {
    ...log,
    timestamp: `${Number(blockInfoOnChain.timestamp) * 1000}`,
  };
}
