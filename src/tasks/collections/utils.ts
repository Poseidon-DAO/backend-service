import { AlchemyNFTCollection } from "./types";

export const formatCollection = (collection: AlchemyNFTCollection) => {
  return {
    platform: collection.contractMetadata.name,
    platformAddress: collection.contract.address,
    tokenId: collection.id.tokenId,
    tokenType: collection.id.tokenMetadata.tokenType,
    title: collection.title,
    balance: collection.balance,
    description: collection.description,
    tokenUriRaw: collection.tokenUri.raw,
    tokenUriGateway: collection.tokenUri.gateway,
    image: collection.metadata.image,
    createdBy: collection.metadata.createdBy,
    yearCreated: collection.metadata.yearCreated,
    mimeType: collection.metadata.media.mimeType,
    mimeUri: collection.metadata.media.mimeType,
    tags: collection.metadata.tags,
    timeLastUpdated: collection.timeLastUpdated,
  };
};
