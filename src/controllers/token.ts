import { Request, Response } from "express";
import { subDays } from "date-fns";
import { groupedTransactionsByDiffInDays } from "@utils/token";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getWeeklyTransfers = async (_: Request, res: Response) => {
  try {
    const transfers = await prismaClient.transfer.findMany({
      where: {
        blockDate: {
          lte: new Date().toISOString(),
          gte: subDays(new Date(), 6).toISOString(),
        },
      },
    });

    const { grouped, sum } = groupedTransactionsByDiffInDays(transfers);

    if (!transfers && !transfers.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({
      totalSumMoved: sum,
      groupedTransfersByDiffInDays: grouped,
    });
  } catch (err) {
    res.send(err.message);
  }
};

/**
 * @route GET /
 */
export const getWeeklyBurned = async (_: Request, res: Response) => {
  try {
    const burns = await prismaClient.burn.findMany({
      where: {
        blockDate: {
          lte: new Date().toISOString(),
          gte: subDays(new Date(), 6).toISOString(),
        },
      },
    });

    const { grouped, sum } = groupedTransactionsByDiffInDays(burns);

    if (!burns && !burns.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({
      totalSumBurned: sum,
      groupedBurnsByDiffInDays: grouped,
    });
  } catch (err) {
    res.send(err.message);
  }
};
