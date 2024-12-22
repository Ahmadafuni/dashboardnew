import { z } from "zod";

export const productCatalogueSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name for the product.",
    })
    .max(255, {
      message: "Maximum characters for the product  name is 255.",
    }),
  description: z.string(),
});

export const productCatalogueDetailSchema = z.object({
  grammage: z
    .string()
    .min(1, { message: "Please enter grammage!" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid decimal point number(e.x 0.1, 12.11, 12)",
    }),
    standardWeight: z
    .string()
    .min(1, { message: "Please enter standard weight!" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid decimal point number(e.x 0.1, 0.2, etc.)",
    })
    .refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 2, {
      message: "Standard weight must be between 0 and 2",
    }),
  // name: z.string(),
  category1: z.string().min(1, { message: "Please select category one!" }),
  category2: z.string().min(1, { message: "Please select category two!" }),
  season: z.string().min(1, { message: "Please select season!" }),
  templateType: z.string().min(1, { message: "Please select template type!" }),
  textile: z.string().min(1, { message: "Please select textile!" }),
  templatePattern: z
    .string()
    .min(1, { message: "Please select template pattern" }),
  description: z.string(),
});
