import { ethers } from "ethers";
import { z } from "zod";

const UserSchema = z.object({
  address: z.string().refine((value) => ethers.utils.isAddress(value), {
    message:
      "Provided address is invalid. Please insure you have typed correctly.",
  }),
});

export { UserSchema };
