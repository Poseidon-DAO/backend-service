import { Alchemy } from "alchemy-sdk";
import sdkSettings from "@sdk/settings";

const alchemySDK = new Alchemy(sdkSettings);

export { alchemySDK };
export * from "alchemy-sdk";
