import { z } from "zod";

export const templateSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name for the template!",
    })
    .max(255),
  description: z.string(),
  productCatalogDetailId: z.string().min(1, {
    message: "Please select a product catalogue detail!",
  }),
});

export const templateProductCatalogueDetailSearchSchema = z.object({
  categoryOne: z.string(),
  categoryTwo: z.string(),
});

export const templateUpdateSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name for the template!",
    })
    .max(255),
  description: z.string(),
});
// name, description, productCatalogDetailId
