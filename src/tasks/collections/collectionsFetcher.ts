import { getCollections } from "./chain/getCollections";
import { createCollections, deleteCollections } from "./db/collection.crud";

async function collectionsFetcher() {
  console.log("READING COLLECTIONS START...");

  try {
    await deleteCollections();

    const collections = await getCollections();

    await createCollections(collections);

    console.log("READING COLLECTIONS END...");
    console.log("===================================== ✅");
  } catch (error) {
    console.error(error);
  }
}

export { collectionsFetcher };
