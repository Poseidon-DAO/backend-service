import { z } from "zod";

const UserSettingsSchema = z.object({
  collectionLayout: z.enum(["table", "column", "grid"]).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  showVotedCollection: z.boolean().optional(),
});

export { UserSettingsSchema };
