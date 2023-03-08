let baseUrl: string;
let apiVersion: string = `/v2/${process.env.ALCHEMY_ID}`;

if (process.env.CHAIN_ID === "0x5") {
  baseUrl = "https://eth-goerli.g.alchemy.com";
} else {
  baseUrl = "https://eth-mainnet.g.alchemy.com";
}

export const BASE_URL = baseUrl + apiVersion;
export const NFT_BASE_URL = baseUrl + "/nft" + apiVersion;
