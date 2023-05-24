import { Prisma, type Collection } from "@prisma/client";
import { type Request, type Response } from "express";

import { prismaClient } from "../db-client";

type Platform = "superrare" | "foundation" | "opensea" | "niftygateway";
type Sort = "most-voted" | "most-loved" | "most-hated";

type CollectionQueryParams = {
  page?: number;
  platform?: Platform;
  query?: string;
  sort?: Sort;
  userId?: Sort;
};

/**
 * @route GET /
 */
export const getCollection = async (
  req: Request<{}, {}, {}, CollectionQueryParams>,
  res: Response
) => {
  const {
    page = 1,
    platform = null,
    query = "",
    sort = null,
    userId = "",
  } = req.query;
  const pageSize = 30;

  try {
    if (!userId) {
      return res.status(404).json({ message: "User id not provided!" });
    }
    const totalCount = await prismaClient.collection.count();
    const userSettings = await prismaClient.userSettings.findUnique({
      where: { userId },
    });

    const showVoted = !!userSettings?.showVotedCollection;

    console.log({ userId, showVoted });

    if (sort === "most-voted") {
      const mostVotedCollection = await prismaClient.collection.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: {
          title: { contains: query, mode: "insensitive" },
          platform: platform ? { equals: platform, mode: "insensitive" } : {},
          votes: showVoted
            ? {}
            : {
                none: { userId: { equals: userId, mode: "insensitive" } },
              },
        },
        include: { votes: true },
        orderBy: { votes: { _count: "desc" } },
      });

      return res.json({
        totalCount,
        pageCount: mostVotedCollection.length,
        pageSize,
        collection: mostVotedCollection,
      });
    }

    if (sort === "most-loved" || sort === "most-hated") {
      const mostLovedHatedCollection: Collection[] =
        await prismaClient.$queryRaw`
          SELECT
            "Collection".*,
            COALESCE(JSON_AGG("Vote".*) FILTER (WHERE "Vote"."vote" IS NOT NULL), '[]') AS "votes"
          FROM
            "Collection"
            LEFT JOIN "Vote" ON "Collection"."id" = "Vote"."collectionId"
            LEFT JOIN "User" ON "Vote"."userId" = "User"."id" 
          WHERE LOWER("Collection"."platform") = LOWER(COALESCE(${platform}, "Collection"."platform"))
            AND  ("Collection"."title" ILIKE ${"%" + query + "%"} )  
            AND (
                ${showVoted} = TRUE OR 
                NOT EXISTS (
                    SELECT 1 FROM "Vote" 
                    WHERE "Vote"."collectionId" = "Collection"."id" AND "Vote"."userId" = ${userId}
                )
            )        
          GROUP BY
            "Collection".id
          ORDER BY
            CASE
              WHEN COUNT("Vote"."vote") FILTER (WHERE "Vote"."vote" = ${
                sort === "most-loved" ? "DOWNVOTE" : "UPVOTE"
              }) > COUNT("Vote"."vote") FILTER (WHERE "Vote"."vote" = ${
          sort === "most-loved" ? "UPVOTE" : "DOWNVOTE"
        })
              THEN 1
              ELSE 0
            END ASC,
            COUNT("Vote"."vote") FILTER (WHERE "Vote"."vote" = ${
              sort === "most-loved" ? "UPVOTE" : "DOWNVOTE"
            }) DESC
          LIMIT ${pageSize} OFFSET ${page} * ${pageSize} - ${pageSize}
      `;

      return res.json({
        totalCount,
        pageCount: mostLovedHatedCollection.length,
        pageSize,
        collection: mostLovedHatedCollection,
      });
    }

    const defaultCollection = await prismaClient.collection.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: {
        platform: platform ? { equals: platform, mode: "insensitive" } : {},
        title: query ? { contains: query, mode: "insensitive" } : {},
        votes: showVoted
          ? {}
          : {
              none: { userId: { equals: userId, mode: "insensitive" } },
            },
      },
      include: { votes: true },
    });

    return res.json({
      totalCount,
      pageCount: defaultCollection.length,
      pageSize,
      collection: defaultCollection,
    });
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
