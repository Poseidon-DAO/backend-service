import { type Request, type Response } from "express";
import { PAGE_SIZE } from "@constants/polls";

import { prismaClient } from "../db-client";

/**
 * @route GET /
 */
export const getPolls = async (
  req: Request<{ page: number }>,
  res: Response
) => {
  const { page = 1 } = req.params;

  let start = PAGE_SIZE * (page - 1);

  try {
    const polls = await prismaClient.poll.findMany({
      skip: start,
      take: PAGE_SIZE,
    });

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
 * @route POST /
 */
export const createPoll = async (
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
