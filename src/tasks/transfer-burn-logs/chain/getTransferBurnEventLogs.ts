import { type Transfer } from "@prisma/client";
import url from "@constants/alchemy-url";
import fetch from "cross-fetch";

export async function getTransferBurnEventLogs(
  fromBlock: string,
  toBlock: string
) {
  console.log("FETCHING LOGS FROM CHAIN START...");

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
          address: process.env.SC_ERC20_ADDRESS,
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          ],
          fromBlock: !!fromBlock ? fromBlock : "earliest",
          toBlock: !!toBlock ? toBlock : "latest",
        },
      ],
    }),
  });
  const logsResponseJson = await logsResponse.json();
  const logs = logsResponseJson.result as Transfer[];

  console.log("FETCHING LOGS FROM CHAIN END...");

  return logs;
}
