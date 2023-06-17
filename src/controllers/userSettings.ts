import { type UserSettings } from "@prisma/client";
import { type Request, type Response } from "express";
import { ZodError } from "zod";

import { prismaClient } from "../db-client";
import { UserSettingsSchema } from "../types/userSettings";

/**
 * @route GET /
 */
export const settings = async (
  req: Request<{}, {}, {}, { userId: string }>,
  res: Response
) => {
  const { userId } = req.query;

  try {
    const userSettings = await prismaClient.userSettings.findUnique({
      where: { userId },
    });

    return res.json(userSettings);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

/**
 * @route POST /
 */
export const updateSettings = async (
  req: Request<
    {},
    {},
    Pick<
      UserSettings,
      "collectionLayout" | "theme" | "userId" | "showVotedCollection"
    >
  >,
  res: Response
) => {
  const { userId } = req.body;
  try {
    const { theme, collectionLayout, showVotedCollection } =
      UserSettingsSchema.parse({
        theme: req.body.theme,
        collectionLayout: req.body.collectionLayout,
        showVotedCollection: req.body.showVotedCollection,
      });

    const newUserSettings = await prismaClient.userSettings.update({
      where: { userId },
      data: {
        theme,
        collectionLayout,
        showVotedCollection,
      },
    });

    return res.json(newUserSettings);
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
