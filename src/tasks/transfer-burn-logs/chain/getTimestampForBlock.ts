import url from "@constants/alchemy-url";
import fetch from "cross-fetch";

export async function getTimeStampForBlock(
  blockNumberOnChain: string,
  logIndex: string
) {
  console.log("FETCHING BLOCK INFORMATION FROM CHAIN START...");

  const blockInfoResponse = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [blockNumberOnChain, false],
    }),
  });
  const blockInfoJsonResponse = await blockInfoResponse.json();
  const blockInfoOnChain = blockInfoJsonResponse?.result;

  console.log(
    `FETCHING BLOCK ${blockNumberOnChain} INFORMATION FROM CHAIN END...`
  );

  return {
    timestamp: `${Number(blockInfoOnChain.timestamp) * 1000}`,
    logIndex,
  };
}
