let baseUrl: string;
let apiKey: string = `${process.env.ALCHEMY_ID}`;
let apiVersion = "v2/";

const mainnetBaseUrl = "https://eth-mainnet.g.alchemy.com/";
const goerliBaseUrl = "https://eth-goerli.g.alchemy.com/";

if (process.env.CHAIN_ID === "0x5") {
  baseUrl = goerliBaseUrl;
} else {
  baseUrl = mainnetBaseUrl;
}

const urlMap = {
  "0x1": mainnetBaseUrl,
  "0x5": goerliBaseUrl,
};

export const getBaseUrl = (chainId?: "0x1" | "0x5") => {
  return (chainId ? urlMap[chainId] : baseUrl) + apiVersion + apiKey;
};

export const getNftBaseUrl = (chainId?: "0x1" | "0x5") => {
  return (chainId ? urlMap[chainId] : baseUrl) + "nft/" + apiVersion + apiKey;
};
