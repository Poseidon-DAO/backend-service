import { type Request, type Response } from "express";
import { ZodError } from "zod";

import { formatArtistApplication, sendEmail } from "@services/mailer";
import {
  slackApplicationSuccess,
  slackApplicationError,
} from "@services/slack";

import { prismaClient } from "../db-client";
import { ArtistProps, ArtistSchema, MetaborgUserSchema } from "../types/artist";

/**
 * @route GET /
 */
export const getArtists = async (
  req: Request<{ page: number }>,
  res: Response
) => {
  try {
    const artists = await prismaClient.artist.findMany({});

    return res.json(artists);
  } catch (err) {
    res.send((err as Error).message);
  }
};

/**
 * @route POST /
 */
export const postArtist = async (
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
