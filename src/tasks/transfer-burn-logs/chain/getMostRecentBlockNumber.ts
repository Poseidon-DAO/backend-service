import url from "@constants/alchemy-url";
import fetch from "cross-fetch";

export async function getBlockOnChain() {
  console.log("FETCHING BLOCK NUMBER FROM CHAIN START...");

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

  console.log("FETCHING BLOCK NUMBER FROM CHAIN END...");

  return blockNumberOnChain;
}
