export interface Contract {
  address: string;
}

export interface TokenMetadata {
  tokenType: string;
}

export interface Id {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

export interface TokenUri {
  gateway: string;
  raw: string;
}

export interface Medium {
  gateway: string;
  thumbnail: string;
  raw: string;
  format: string;
  bytes: number;
}

export interface Media {
  mimeType: string;
  size: string;
  uri: string;
  dimensions: string;
}

export interface Metadata {
  image: string;
  createdBy: string;
  yearCreated: string;
  name: string;
  description: string;
  media: Media;
  tags: string[];
}

export interface OpenSea {
  floorPrice: number;
  collectionName: string;
  safelistRequestStatus: string;
  imageUrl: string;
  description: string;
  externalUrl: string;
  twitterUsername: string;
  discordUrl: string;
  lastIngestedAt: Date;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSea: OpenSea;
}

export interface AlchemyNFTCollection {
  contract: Contract;
  id: Id;
  balance: string;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Medium[];
  metadata: Metadata;
  timeLastUpdated: Date;
  contractMetadata: ContractMetadata;
}
