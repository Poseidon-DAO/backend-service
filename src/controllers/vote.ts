import { groupVotesByTimestamp } from "@utils/vote";
import { subDays } from "date-fns";

import { prismaClient } from "db-client";

import { type Request, type Response } from "express";

/**
 * @route GET /
 */
export const getVoteStats = async (
  req: Request<{}, {}, {}, { days: 7 | 10 | 30 }>,
  res: Response
) => {
  const { days = 7 } = req.query;

  if (![7, 10, 30].includes(Number(days))) {
    return res.status(404).json({
      error: `The days param has to be one of these values: [7, 10, 30]. Invalid days param <${days}>!`,
    });
  }

  try {
    const votes = await prismaClient.vote.findMany({
      where: {
        updatedAt: {
          lte: new Date().toISOString(),
          gte: subDays(new Date(), days - 1).toISOString(),
        },
      },
      orderBy: { updatedAt: "asc" },
    });

    const groupedVotes = groupVotesByTimestamp(votes);

    return res.json({
      totalVotes: votes.length,
      votes: groupedVotes,
    });
  } catch (err) {
    res.send((err as Error).message);
  }
};
