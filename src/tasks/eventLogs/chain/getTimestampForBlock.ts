import { type EventLog } from "@prisma/client";
import fetch from "cross-fetch";

import { BASE_URL } from "@constants/alchemy-url";

export async function getTimeStampForBlock(log: EventLog) {
  console.log(
    `READING BLOCK ${log.blockNumber} INFORMATION FROM CHAIN START...`
  );

  const blockInfoResponse = await fetch(BASE_URL, {
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

  return {
    ...log,
    timestamp: `${Number(blockInfoOnChain.timestamp) * 1000}`,
  };
}
