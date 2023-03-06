import { z } from "zod";

const ArtistSchema = z.object({
  name: z
    .string({ required_error: "The name field is required." })
    .trim()
    .min(3, "The name field must contain at least 3 characters.")
    .max(70, "The name field must contain less than 70 characters."),
  email: z
    .string()
    .toLowerCase()
    .trim()
    .email({ message: "The email field has a wrong email." }),
  bio: z
    .string()
    .min(10, "The bio field must contain at least 10 characters.")
    .max(1000, "The bio field must contain less than 1000 characters."),
  exhibitions: z
    .string()
    .min(10, "The exhibitions field must contain at least 10 characters.")
    .max(1000, "The exhibitions field must contain less than 1000 characters.")
    .optional(),
  samples: z
    .string()
    .url({ message: "The samples field has a wrong url." })
    .optional(),
  twitter_url: z
    .string()
    .url()
    .regex(
      /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/,
      "The twitter_url field has a wrong url."
    ),
  instagram_url: z
    .string()
    .url()
    .regex(
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/,
      "The instagram_url field has a wrong url."
    )
    .optional(),
  website: z
    .string()
    .url({ message: "The website field has a wrong url." })
    .optional(),
  project: z.enum(["Derivatives", "Genesis", "Other"]),
});

type ArtistProps = z.infer<typeof ArtistSchema>;

export { ArtistProps, ArtistSchema };
