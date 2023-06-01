import { type Request, type Response } from "express";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const search = async (
  req: Request<{}, {}, {}, { query: string }>,
  res: Response
) => {
  const { query } = req.query;

  try {
    const searchResults = await prismaClient.collection.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          {
            description: { contains: query, mode: "insensitive" },
          },
        ],
      },
      select: {
        id: true,
        image: true,
        title: true,
      },
      take: 6,
    });

    return res.json({ count: searchResults.length, results: searchResults });
  } catch (err) {
    res.send((err as Error).message);
  }
};
