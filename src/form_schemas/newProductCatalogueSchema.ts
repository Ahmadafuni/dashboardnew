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

export const productCatalogueDetailSchema = z.object({
  grammage: z
    .number()
    .multipleOf(0.01)
    .positive({ message: "Enter a value greater than zero!" }),
  standardWeight: z
    .number()
    .multipleOf(0.01)
    .positive({ message: "Enter a value greater than zero!" }),
  category1: z.string().min(1, { message: "Please select category one!" }),
  category2: z.string().min(1, { message: "Please select category two!" }),
  season: z.string().min(1, { message: "Please select season!" }),
  templateType: z.string().min(1, { message: "Please select template type!" }),
  textile: z.string().min(1, { message: "Please select textile!" }),
  templatePattern: z
    .string()
    .min(1, { message: "Please select template pattern!" }),
  description: z.string(),
});
