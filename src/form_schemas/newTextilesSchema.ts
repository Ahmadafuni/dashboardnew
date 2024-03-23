import { z } from "zod";

export const newTextilesSchema = z.object({
  textileName: z
    .string()
    .min(1, {
      message: "Please enter a textile name.",
    })
    .max(255, {
      message: "Maximum characters for the textile name is 255.",
    }),
  textileType: z
    .string()
    .min(1, {
      message: "Please enter a textile type.",
    })
    .max(255, {
      message: "Maximum characters for the textile type is 255.",
    }),
  composition: z.string().max(255, {
    message: "Maximum characters for the composition is 255.",
  }),
  description: z.string().max(255).optional(),
});
