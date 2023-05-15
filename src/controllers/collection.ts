import { Prisma } from "@prisma/client";
import { type Request, type Response } from "express";

import { prismaClient } from "../db-client";

type Platform = "superrare" | "foundation" | "opensea" | "niftygateway";
type Sorting = "most-voted" | "most-loved" | "most-hated";

type CollectionQueryParams = {
  platform: Platform;
  sorting: Sorting;
};

/**
 * @route GET /
 */
export const getCollection = async (
  req: Request<{}, {}, {}, CollectionQueryParams>,
  res: Response
) => {
  const { platform = null, sorting } = req.query;

  try {
    if (sorting === "most-voted") {
      const mostVotedCollection = await prismaClient.collection.findMany({
        where: {
          platform: platform ? { equals: platform, mode: "insensitive" } : {},
        },
        include: { votes: true },
        orderBy: { votes: { _count: "desc" } },
      });

      return res.json(mostVotedCollection);
    }

    if (sorting === "most-loved" || sorting === "most-hated") {
      const mostLovedCollection = await prismaClient.$queryRaw`
        SELECT
          "Collection".*,
          COALESCE(JSON_AGG("Vote".*) FILTER (WHERE "Vote"."vote" IS NOT NULL), '[]') AS "votes"
        FROM
          "Collection"
          LEFT JOIN "Vote" ON "Collection"."id" = "Vote"."collectionId"
          LEFT JOIN "User" ON "Vote"."userId" = "User"."id"
          WHERE LOWER("Collection"."platform") = LOWER(COALESCE(${platform}, "Collection"."platform"))
        GROUP BY
          "Collection".id
        ORDER BY
          CASE
            WHEN COUNT("Vote"."vote") FILTER (WHERE "Vote"."vote" = ${
              sorting === "most-loved" ? "DOWNVOTE" : "UPVOTE"
            }) > COUNT("Vote"."vote") FILTER (WHERE "Vote"."vote" = ${
        sorting === "most-loved" ? "UPVOTE" : "DOWNVOTE"
      })
            THEN 1
            ELSE 0
          END ASC,
          COUNT("Vote"."vote") FILTER (WHERE "Vote"."vote" = ${
            sorting === "most-loved" ? "UPVOTE" : "DOWNVOTE"
          }) DESC
      `;

      return res.json(mostLovedCollection);
    }

    const defaultCollection = await prismaClient.collection.findMany({
      where: {
        platform: platform ? { equals: platform, mode: "insensitive" } : {},
      },
      include: { votes: true },
    });

    return res.json(defaultCollection);
  } catch (err) {
    res.send((err as Error).message);
  }
};

type VoteCollectionBody = {
  collectionId: string;
  userAddress: string;
  vote: "UPVOTE" | "DOWNVOTE";
};

/**
 * @route POST /
 */
export const voteCollection = async (
  req: Request<{}, {}, VoteCollectionBody>,
  res: Response
) => {
  const { collectionId, userAddress, vote } = req.body;

  try {
    const user = await prismaClient.user.findFirst({
      where: { address: { equals: userAddress, mode: "insensitive" } },
    });

    if (!user) {
      return res.status(404).json({
        error: `User with address: <${userAddress}> does not exist!`,
      });
    }

    if (!user.isGuardian) {
      return res.status(401).json({
        error: `User with address: <${userAddress}> is not a Guardian, thus is not allowed to vote!`,
      });
    }

    const collection = await prismaClient.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return res.status(404).json({
        error: `Collection with id: <${collectionId}> does not exist!`,
      });
    }

    const newVote = await prismaClient.vote.create({
      data: {
        collectionId,
        userId: user.id,
        vote,
      },
    });

    return res.json(newVote);
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(422).json({
          error:
            "There is a unique constraint violation, the collection is already voted!",
        });
      }
    }

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

/**
 * @route PATCH /
 */
export const revoteCollection = async (
  req: Request<{}, {}, VoteCollectionBody>,
  res: Response
) => {
  const { collectionId, userAddress, vote } = req.body;

  try {
    const user = await prismaClient.user.findFirst({
      where: { address: { equals: userAddress, mode: "insensitive" } },
    });

    if (!user) {
      return res.status(404).json({
        error: `User with address: <${userAddress}> does not exist!`,
      });
    }

    if (!user.isGuardian) {
      return res.status(401).json({
        error: `User with address: <${userAddress}> is not a Guardian, thus is not allowed to vote!`,
      });
    }

    const collection = await prismaClient.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return res.status(404).json({
        error: `Collection with id: <${collectionId}> does not exist!`,
      });
    }

    const updatedVote = await prismaClient.vote.update({
      where: {
        userId_collectionId: {
          collectionId,
          userId: user.id,
        },
      },
      data: {
        collectionId,
        userId: user.id,
        vote,
      },
    });

    return res.json(updatedVote);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
