import { CronJob } from "cron";
import fetch from "cross-fetch";

import url from "@constants/alchemy-url";
import { prismaClient } from "db-client";

const fetchLogs = new CronJob(
  "*/15 * * * *",
  async function () {
    /*
    👇🏻 ======================================================================== 
    */
    console.log("FETCHING LOGS START...");

    try {
      /*
      👇🏻 ======================================================================== 
      */
      console.log("FETCHING BLOCK NUMBER FROM DATABASE...");

      const blockNumberOnDatabase = await prismaClient.block.findFirst();

      /*
      👇🏻 ======================================================================== 
      */
      console.log("FETCHING BLOCK NUMBER FROM CHAIN...");

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

      if (!blockNumberOnDatabase) {
        /*
        👇🏻 ======================================================================== 
        */
        console.log("CREATING BLOCK NUMBER ON DATABASE...");

        await prismaClient.block.create({
          data: { blockNo: blockNumberOnChain },
        });
      } else {
        /*
        👇🏻 ======================================================================== 
        */
        console.log("UPDATING BLOCK NUMBER ON DATABASE...");

        await prismaClient.block.update({
          data: { blockNo: blockNumberOnChain },
          where: { id: blockNumberOnDatabase.id },
        });
      }

      /*
      👇🏻 ======================================================================== 
      */
      console.log("FETCHING LOGS FROM CHAIN...");

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
              fromBlock: !!blockNumberOnDatabase?.blockNo
                ? (Number(blockNumberOnDatabase?.blockNo) + 1).toString(16)
                : "earliest",
              toBlock: "latest",
            },
          ],
        }),
      });
      const logsResponseJson = await logsResponse.json();
      const logs = logsResponseJson.result;

      if (!!logs?.length) {
        /*
        👇🏻 ========================================================================
        */
        console.log("CREATING TRANSACTION ON DATABASE...");

        await prismaClient.transaction.createMany({
          data: logs,
        });
      }

      /*
      👇🏻 ======================================================================== 
      */
      console.log("FETCHING LOGS END...");
      console.log(
        "============================================================= ✅"
      );
    } catch (error) {
      console.error(error);
    }
  },
  null,
  true
);

export { fetchLogs };
