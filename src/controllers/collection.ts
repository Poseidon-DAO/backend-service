import { Prisma } from "@prisma/client";
import { type Request, type Response } from "express";

import { prismaClient } from "../db-client";

type Platform = "superrare" | "foundation" | "opensea" | "niftygateway";

/**
 * @route GET /
 */
export const get = async (
  req: Request<{ platform: Platform }>,
  res: Response
) => {
  const { platform } = req.params;

  try {
    const collection = await prismaClient.collection.findMany({
      where: { platform: { equals: platform } },
    });

    if (!collection) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json(collection);
  } catch (err) {
    res.send((err as Error).message);
  }
};

type VoteCollectionBody = {
  collectionId: string;
  userAddress: string;
  vote: 0 | 1;
};

/**
 * @route POST /
 */
export const vote = async (
  req: Request<{}, {}, VoteCollectionBody>,
  res: Response
) => {
  const { collectionId, userAddress, vote } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { address: userAddress },
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
        vote: !!vote ? "UPVOTE" : "DOWNVOTE",
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
export const revote = async (
  req: Request<{}, {}, VoteCollectionBody>,
  res: Response
) => {
  const { collectionId, userAddress, vote } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { address: userAddress },
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
        vote: !!vote ? "UPVOTE" : "DOWNVOTE",
      },
    });

    return res.json(updatedVote);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
