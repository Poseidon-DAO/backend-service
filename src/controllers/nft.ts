import { type Request, type Response } from "express";
import { subDays } from "date-fns";

import { groupWeeklyMintedNFTLogs } from "@utils/nft";
import { getRatio } from "@chain/getRatio";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getWeeklyMinted = async (_: Request, res: Response) => {
  try {
    const mints = await prismaClient.eventLog.findMany({
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

    return res.json({
      totalSumMint: sum,
      weeklyMints: groupedLogs,
    });
  } catch (err) {
    res.send((err as Error).message);
  }
};

/**
 * @route GET /
 */
export const totalNfts = async (_: Request, res: Response) => {
  try {
    const nfts = await prismaClient.eventLog.findMany({
      where: { functionName: { equals: "burnAndReceiveNFT" } },
    });

    const ratio = await getRatio();

    const countGNfts = nfts.reduce((acc, item) => {
      return (acc += Number(item.data) / ratio);
    }, 0);

    return res.json({
      totalNfts: countGNfts,
    });
  } catch (err) {
    res.send((err as Error).message);
  }
};
