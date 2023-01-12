import { Request, Response } from "express";
import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getWeeklyMoved = async (req: Request, res: Response) => {
  try {
    const polls = await prismaClient.transaction.findMany();

    if (!polls && !polls.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json(polls);
  } catch (err) {
    res.send(err.message);
  }
};

/**
 * @route GET /
 */
export const getWeeklyBurned = async (
  req: Request<{}, {}, { hex: string; description: string }>,
  res: Response
) => {
  const { description = "", hex } = req.body;

  try {
    const pollExists = await prismaClient.poll.findUnique({
      where: { hex: Number(hex) },
    });

    if (pollExists) {
      res.statusCode = 409;
      throw new Error("Poll exists!");
    }

    const result = await prismaClient.poll.create({
      data: {
        hex: Number(hex),
        description,
      },
    });

    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
};
