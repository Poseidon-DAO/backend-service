import { type Request, type Response } from "express";

import {
  formatArtistApplication,
  formatMetaborgBurnSubmit,
  sendEmail,
} from "@services/mailer";
import {
  slackApplicationSuccess,
  slackApplicationError,
} from "@services/slack";
import { prismaClient } from "../db-client";
import { ArtistProps, ArtistSchema, MetaborgUserSchema } from "../types/artist";
import { ZodError } from "zod";

/**
 * @route GET /
 */
export const getArtists = async (
  req: Request<{ page: number }>,
  res: Response
) => {
  try {
    const artists = await prismaClient.artist.findMany({});

    if (!artists.length) {
      res.statusCode = 404;
      throw new Error("No data available!");
    }

    return res.json(artists);
  } catch (err) {
    res.send((err as Error).message);
  }
};

/**
 * @route POST /
 */
export const submitApplication = async (
  req: Request<{ page: number }, {}, ArtistProps>,
  res: Response
) => {
  try {
    const validatedArtist = ArtistSchema.parse(req.body);

    const newArtist = await prismaClient.artist.create({
      data: validatedArtist,
    });

    await sendEmail(
      process.env.POSTMARK_SENDER!,
      process.env.POSTMARK_RECEIVER!,
      process.env.POSTMARK_SUBJECT!,
      formatArtistApplication(validatedArtist)
    );
    await slackApplicationSuccess(validatedArtist);

    return res.json(newArtist);
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = err.flatten().fieldErrors;

      const errorMessage = {
        message: "Validation error",
        errors: formattedErrors,
      };

      return res.status(400).json(errorMessage);
    }

    await slackApplicationError(req.body, JSON.stringify(err));
    res.status(400).json({ message: (err as Error).message });
  }
};

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
