import { type Request, type Response } from "express";
import { ZodError } from "zod";

import { formatMetaborgBurnSubmit, sendEmail } from "@services/mailer";

import { prismaClient } from "../db-client";
import { MetaborgUserSchema } from "../types/artist";

/**
 * @route POST /
 */
export const submitMetaborgBurn = async (
  req: Request<
    {},
    {},
    {
      name: string;
      phone: string;
      email: string;
      address: string;
      country: string;
      state: string;
      zip: string;
      tokenId: string;
    }
  >,
  res: Response
) => {
  try {
    const validatedUser = MetaborgUserSchema.parse(req.body);

    await prismaClient.metaborgBurnUsers.create({
      data: validatedUser,
    });

    await sendEmail(
      process.env.POSTMARK_SENDER!,
      process.env.POSTMARK_SENDER_GIOVANNI_MOTTA_EMAIL!,
      process.env.POSTMARK_SUBJECT!,
      formatMetaborgBurnSubmit(validatedUser)
    );

    return res.json({});
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = err.flatten().fieldErrors;

      const errorMessage = {
        message: "Validation error",
        errors: formattedErrors,
      };

      return res.status(400).json(errorMessage);
    }

    res.status(400).json({ message: (err as Error).message });
  }
};
