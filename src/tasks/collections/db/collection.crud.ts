import { prismaClient } from "db-client";
import { AlchemyNFTCollection } from "../types";
import { formatCollection } from "../utils";

export async function createCollections(collections: AlchemyNFTCollection[]) {
  console.log("CREATING COLLECTIONS ON DATABASE START...");

  await Promise.all(
    collections.map((collection) => {
      const formatedCollection = formatCollection(collection);

      return prismaClient.collection.upsert({
        where: {
          platformAddress_tokenId: {
            platformAddress: formatedCollection.platformAddress,
            tokenId: formatedCollection.tokenId,
          },
        },
        update: formatedCollection,
        create: formatedCollection,
      });
    })
  );

  console.log("CREATING COLLECTIONS ON DATABASE END...");
}

export async function deleteCollections() {
  console.log("DELETING COLLECTIONS ON DATABASE START...");

  await prismaClient.collection.deleteMany();

  console.log("DELETING COLLECTIONS ON DATABASE END...");
}
