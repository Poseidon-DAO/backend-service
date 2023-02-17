import { type Request, type Response } from "express";
import { subDays } from "date-fns";
import {
  groupAirdropsByDate,
  groupWeeklyTransferEventLogs,
} from "@utils/token";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getWeeklyTransfers = async (_: Request, res: Response) => {
  try {
    const transfers = await prismaClient.eventLog.findMany({
      where: {
        OR: [
          {
            functionName: { equals: "transfer" },
          },
          {
            functionName: { equals: "runAirdrop" },
          },
          {
            functionName: { equals: "withdrawVest" },
          },
        ],
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
export const getWeeklyBurned = async (_: Request, res: Response) => {
  try {
    const burns = await prismaClient.eventLog.findMany({
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

/**
 * @route GET /
 */
export const getAirdrops = async (_: Request, res: Response) => {
  try {
    const airdrops = await prismaClient.eventLog.findMany({
      where: { functionName: { equals: "runAirdrop" } },
      orderBy: { blockDate: "asc" },
    });

    const { groupedLogs } = groupAirdropsByDate(airdrops);

    if (!airdrops && !airdrops.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({ airdrops: groupedLogs });
  } catch (err) {
    res.send(err.message);
  }
};

/**
 * @route GET /
 */
export const getVests = async (_: Request, res: Response) => {
  try {
    const vests = await prismaClient.eventLog.findMany({
      where: { functionName: { equals: "airdropVest" } },
      orderBy: { blockDate: "asc" },
    });

    const { groupedLogs } = groupAirdropsByDate(vests);

    if (!vests && !vests.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({ vests: groupedLogs });
  } catch (err) {
    res.send(err.message);
  }
};

/**
 * @route GET /
 */
export const getAiradropUsers = async (req: Request, res: Response) => {
  try {
    const {
      tokenId = "",
      amount = "",
      fromDate = "",
      toDate = "",
      snapshot = "",
    } = req.body;

    const airdropUsers = await prismaClient.airdropUsers.findMany({
      where: {
        AND: [
          {
            ...(!!tokenId && {
              tokenId: { equals: tokenId },
            }),
            ...(!!snapshot && {
              snapshotNumber: { equals: snapshot },
            }),
            ...(!!amount && {
              amount: { equals: amount },
            }),
            ...(!!fromDate &&
              !!toDate && {
                blockDate: {
                  gte: new Date(fromDate).toISOString(),
                  lte: new Date(toDate).toISOString(),
                },
              }),
          },
        ],
      },
    });

    const totalNfts = airdropUsers.reduce((acc, item) => acc + item.amount, 0);

    if (!airdropUsers && !airdropUsers.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json({ totalNfts, users: airdropUsers });
  } catch (err) {
    res.send(err.message);
  }
};
