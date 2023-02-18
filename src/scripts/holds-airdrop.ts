import fetch from "cross-fetch";
import dotenv from "dotenv";
import EthDater from "ethereum-block-by-date";
import { providers } from "ethers";

import { prismaClient } from "../db-client";

dotenv.config();

const date = process.argv[2];
const snapshotNumber = Number(process.argv[3]) || 2;
const smartContractAddress = process.env.SC_MANIFOLD_ADDRESS;
const alchemyId = process.env.ALCHEMY_ID;
const url = (blockToHex: string) =>
  `https://eth-mainnet.g.alchemy.com/nft/v2/${alchemyId}/getOwnersForCollection?contractAddress=${smartContractAddress}&withTokenBalances=true&block=${blockToHex}`;

const provider = new providers.AlchemyProvider("homestead", alchemyId);
const dater = new EthDater(provider);

type OwnerCollection = {
  ownerAddress: string;
  tokenBalances: {
    tokenId: string;
    balance: number;
  }[];
};

async function main() {
  await prismaClient.airdropUsers.deleteMany({
    where: { snapshotNumber },
  });

  const { block, timestamp } = await dater.getDate(
    new Date(date).toISOString(),
    true,
    false
  );
  const blockToHex = "0x" + block.toString(16);

  const ownersForCollectionResponse = await fetch(url(blockToHex));
  if (!ownersForCollectionResponse.ok) {
    throw new Error("Something went wrong");
  }
  const ownersForCollection = (await ownersForCollectionResponse.json()) as {
    ownerAddresses: OwnerCollection[];
  };

  const flatOwnerCollectionWithTokenIds =
    ownersForCollection.ownerAddresses.reduce<OwnerCollection[]>(
      (acc, item) => {
        if (!item.tokenBalances.length) {
          return acc;
        }

        const tokenBalances = item.tokenBalances.map((tokenBalance) => {
          return {
            ownerAddress: item.ownerAddress,
            tokenBalances: [tokenBalance],
          };
        });

        tokenBalances.forEach((tokenBalance) => {
          acc.push(tokenBalance);
        });

        return acc;
      },
      []
    );

  const formatedOwnersData = flatOwnerCollectionWithTokenIds.map(
    (ownerCollection: OwnerCollection) => {
      return {
        address: ownerCollection.ownerAddress,
        amount: ownerCollection.tokenBalances[0].balance,
        tokenId: Number(ownerCollection.tokenBalances[0].tokenId),
        provider: "Manifold",
        blockDate: new Date(Number(timestamp) * 1000),
        timestamp: `${Number(timestamp) * 1000}`,
        blockNumber: blockToHex,
        snapshotNumber,
      };
    }
  );

  await prismaClient.airdropUsers.createMany({ data: formatedOwnersData });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
