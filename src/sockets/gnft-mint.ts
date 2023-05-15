import { type Log } from "alchemy-sdk";
import { utils } from "ethers";
import keccak256 from "keccak256";

import ERC1155Abi from "@contracts/ERC1155Abi.json";
import { EMPTY_ADDRESS } from "@constants/token";
import { prismaClient } from "db-client";

const TRANSFER_SINGLE_TOPIC = `0x${keccak256(
  "TransferSingle(address,address,address,uint256,uint256)"
).toString("hex")}`;

export const mintEventconfig = {
  address: process.env.SC_ERC1155_ADDRESS,
  topics: [TRANSFER_SINGLE_TOPIC, null, EMPTY_ADDRESS],
};

const ERC1155Interface = new utils.Interface(ERC1155Abi);

export const onGNftMint = async (txnLog: Log) => {
  const decodedInput = ERC1155Interface.parseLog(txnLog);

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        address: decodedInput.args.to,
      },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          address: decodedInput.args.to,
          gNfts: BigInt(decodedInput.args.value).toString(),
          isGuardian: true,
        },
      });

      return;
    }

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        gNfts: (
          BigInt(user.gNfts) + BigInt(decodedInput.args.value)
        ).toString(),
        isGuardian: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
