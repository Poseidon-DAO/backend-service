import { type EventLog } from "@prisma/client";
import { utils } from "ethers";
import fetch from "cross-fetch";

import { BASE_URL } from "@constants/alchemy-url";
import ERC20Abi from "@contracts/ERC20Abi.json";

import { TRANSFER_EVENT_SIGNITURE } from "../constants";

const ERC20Interface = new utils.Interface(ERC20Abi);

export async function getTransferEventLogs(fromBlock: string, toBlock: string) {
  console.log("READING TRANSFER EVENT LOGS FROM CHAIN START...");

  const transferEventlogsResponse = await fetch(BASE_URL, {
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
          topics: [TRANSFER_EVENT_SIGNITURE],
          fromBlock: !!fromBlock ? fromBlock : "earliest",
          toBlock: !!toBlock ? toBlock : "latest",
        },
      ],
    }),
  });
  const transferEventlogsResponseJson = await transferEventlogsResponse.json();
  const transferEventLogs = (transferEventlogsResponseJson.result ||
    []) as EventLog[];

  const transferEventLogsWithFunctionNames = await Promise.all(
    transferEventLogs?.map(async (log: EventLog) => {
      console.log(
        `READING TRANSACTION BY HASH FOR LOG ${log.blockHash} FROM CHAIN START...`
      );
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          params: [log.transactionHash],
          method: "eth_getTransactionByHash",
        }),
      });

      const data = await res.json();

      const decodedInput = ERC20Interface.parseTransaction({
        data: data.result.input,
        value: data.result.value,
      });

      console.log(
        `READING TRANSACTION BY HASH FOR LOG ${log.blockHash} FROM CHAIN END...`
      );

      return {
        ...log,
        functionName: decodedInput.name,
      };
    })
  );

  console.log("READING TRANSFER EVENT LOGS FROM CHAIN END...");

  return transferEventLogsWithFunctionNames;
}
