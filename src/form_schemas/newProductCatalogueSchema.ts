import { z } from "zod";

export const productCatalogueSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name for the product catalogue.",
    })
    .max(255, {
      message: "Maximum characters for the product catalogue name is 255.",
    }),
  description: z.string(),
});
