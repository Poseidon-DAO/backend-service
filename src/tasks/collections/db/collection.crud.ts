import { prismaClient } from "db-client";
import { AlchemyNFTCollection } from "../types";
import { formatCollection } from "../utils";

export async function createCollections(collections: AlchemyNFTCollection[]) {
  console.log("CREATING COLLECTIONS ON DATABASE START...");

  await prismaClient.collection.createMany({
    data: collections.map((collection) => formatCollection(collection)),
  });

  console.log("CREATING COLLECTIONS ON DATABASE END...");
}

export async function deleteCollections() {
  console.log("DELETING COLLECTIONS ON DATABASE START...");

  await prismaClient.collection.deleteMany({});

  console.log("DELETING COLLECTIONS ON DATABASE END...");
}
