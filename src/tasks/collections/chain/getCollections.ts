import fetch from "cross-fetch";

import { NFT_BASE_URL } from "@constants/alchemy-url";
import { AlchemyNFTCollection } from "../types";

export async function getCollections() {
  console.log("READING COLLECTIONS CHAIN START...");

  const collectionsResponse = await fetch(
    NFT_BASE_URL +
      `/getNFTs?owner=${process.env.SC_PDN_ON_SUPERRARE}&contractAddresses%5B%5D=${process.env.SC_SUPERRARE}&withMetadata=true`
  );
  const collectionsJson = await collectionsResponse.json();
  const collections = (collectionsJson.ownedNfts ||
    []) as AlchemyNFTCollection[];

  console.log("READING COLLECTIONS CHAIN END...");

  return collections;
}
