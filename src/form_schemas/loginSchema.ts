import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter a username.",
    })
    .max(50),
  password: z
    .string()
    .min(1, {
      message: "Please enter a password.",
    })
    .max(50),
});
