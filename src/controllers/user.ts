import { type Request, type Response } from "express";
import { ZodError } from "zod";

import { prismaClient } from "../db-client";
import { UserSchema } from "../types/user";

/**
 * @route POST /
 */
export const register = async (
  req: Request<{}, {}, { address: string }>,
  res: Response
) => {
  try {
    const { address } = UserSchema.parse(req.body);

    const user = await prismaClient.user.findUnique({
      where: { address },
    });

    if (!!user) {
      return res.status(409).json({
        error: `User with address: <${address}> already exists!`,
        user,
      });
    }

    const newUser = await prismaClient.user.create({
      data: {
        address,
        settings: { create: {} },
      },
    });

    return res.json(newUser);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      const formattedErrors = error.flatten().fieldErrors;

      const errorMessage = {
        message: "Validation error",
        errors: formattedErrors,
      };

      return res.status(400).json(errorMessage);
    }

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
