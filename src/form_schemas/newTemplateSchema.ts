import { z } from "zod";

export const templateSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name for the template!",
    })
    .max(255),
  description: z.string(),
  productCatalog: z
    .string()
    .min(1, { message: "Please select product catalogue!" }),
  category1: z.string().min(1, { message: "Please select category one!" }),
  category2: z.string().min(1, { message: "Please select category two!" }),
  season: z.string().min(1, { message: "Please select season!" }),
  templateType: z.string().min(1, { message: "Please select template type!" }),
  templatePattern: z
    .string()
    .min(1, { message: "Please select template pattern" }),
});

export const templateProductCatalogueDetailSearchSchema = z.object({
  categoryOne: z.string(),
  categoryTwo: z.string(),
  productCatalogue: z.string(),
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
