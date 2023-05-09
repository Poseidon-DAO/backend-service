import { Network } from "alchemy-sdk";

export const settings = {
  apiKey: process.env.ALCHEMY_ID,
  network:
    process.env.CHAIN_ID === "0x1" ? Network.ETH_MAINNET : Network.ETH_GOERLI,
};

export * from "./gnft-mint";
