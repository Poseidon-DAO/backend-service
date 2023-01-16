import { type Request, type Response } from "express";
import { subDays } from "date-fns";
import { groupWeeklyTransferEventLogs } from "@utils/token";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getWeeklyMinted = async (_: Request, res: Response) => {
  try {
    const transfers = await prismaClient.transferEventLog.findMany({
      where: {
        functionName: { equals: "burnAndReceiveNFT" },
        blockDate: {
          lte: new Date().toISOString(),
          gte: subDays(new Date(), 6).toISOString(),
        },
      },
    });

    const { groupedLogs, sum } = groupWeeklyTransferEventLogs(transfers);

    if (!transfers && !transfers.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({
      totalSumMoved: sum,
      weeklyTransfers: groupedLogs,
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
    const burns = await prismaClient.transferEventLog.findMany({
      where: {
        OR: [
          {
            functionName: { equals: "burn" },
          },
          {
            functionName: { equals: "burnAndReceiveNFT" },
          },
        ],
        blockDate: {
          lte: new Date().toISOString(),
          gte: subDays(new Date(), 6).toISOString(),
        },
      },
    });

    const { groupedLogs, sum } = groupWeeklyTransferEventLogs(burns);

    if (!burns && !burns.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({
      totalSumBurned: sum,
      weeklyBurns: groupedLogs,
    });
  } catch (err) {
    res.send(err.message);
  }
};
