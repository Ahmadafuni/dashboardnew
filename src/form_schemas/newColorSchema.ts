import { z } from "zod";

export const colorSchema = z.object({
  ColorName: z
    .string()
    .min(1, { message: "Please enter a color name!" })
    .max(50)
    .refine((value) => value.trim().length > 0, {
      message: "Please enter a color name (1-50 characters)!",
    }),
  ColorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message:
      "Please enter a valid color code in hexadecimal format (e.g., #RRGGBB)!",
  }),
  Description: z.string().max(255).optional(),
});
