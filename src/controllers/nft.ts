import { type Request, type Response } from "express";
import { subDays } from "date-fns";
import { ethers } from "ethers";

import { groupWeeklyMintedNFTLogs } from "@utils/nft";
import { getRatio } from "@chain/getRatio";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getWeeklyMinted = async (_: Request, res: Response) => {
  try {
    const mints = await prismaClient.transferEventLog.findMany({
      where: {
        functionName: { equals: "burnAndReceiveNFT" },
        blockDate: {
          lte: new Date().toISOString(),
          gte: subDays(new Date(), 6).toISOString(),
        },
      },
    });

    const ratio = await getRatio();

    const { groupedLogs, sum } = groupWeeklyMintedNFTLogs(mints, Number(ratio));

    if (!mints && !mints.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({
      totalSumMint: sum,
      weeklyMints: groupedLogs,
    });
  } catch (err) {
    res.send(err.message);
  }
};

/**
 * @route GET /
 */
export const totalNfts = async (_: Request, res: Response) => {
  try {
    const nfts = await prismaClient.transferEventLog.findMany({
      where: {
        functionName: { equals: "burnAndReceiveNFT" },
      },
    });

    const ratio = await getRatio();

    const countGNfts = nfts.reduce((acc, item) => {
      return (acc += Number(ethers.utils.formatEther(item.data)) / ratio);
    }, 0);

    if (!nfts && !nfts.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({
      totalNfts: countGNfts,
    });
  } catch (err) {
    res.send(err.message);
  }
};
