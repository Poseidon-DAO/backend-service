import { getCollections } from "./chain/getCollections";
import { createCollections } from "./db/collection.crud";

async function collectionsFetcher() {
  console.log("READING COLLECTIONS START...");

  try {
    const collections = await getCollections();

    await createCollections(collections);

    console.log("READING COLLECTIONS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { collectionsFetcher };
