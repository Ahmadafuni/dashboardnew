import { z } from "zod";

export const materialCategorySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a category name.",
    })
    .max(255, {
      message: "Maximum characters for the category name is 255.",
    }),
  description: z.string().max(255),
});
