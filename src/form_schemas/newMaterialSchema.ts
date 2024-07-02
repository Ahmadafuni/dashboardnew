import { z } from "zod";

export const parentMaterialSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a material name.",
    })
    .max(255, {
      message: "Maximum characters for the material name is 255.",
    }),
  category: z.string().min(1, { message: "Please select template." }),
  unitOfMeasure: z
    .string()
    .min(1, {
      message: "Please enter a unit of measure.",
    })
    .max(255, {
      message: "Maximum characters for the unit of measure is 255.",
    }),
  usageLocation: z.string().min(0).max(255, {
    message: "Maximum characters for the usage location is 255.",
  }),
  alternativeMaterials: z.string(),
  isRelevantToProduction: z.boolean(),
  hasChildren: z.boolean(),
  minimumLimit: z
    .string()
    .min(1, { message: "Please enter minimum limit!" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid decimal point number(e.x 0.1, 12.11, 12)",
    }),
  description: z.string(),
});

export const childMaterialSchema = z.object({
  Name: z
    .string()
    .min(1, {
      message: "Please enter a child material name.",
    })
    .max(255, {
      message: "Maximum characters for the material name is 255.",
    }),
  DyeNumber: z.string(),
  Kashan: z.string(),
  Halil: z.string(),
  Phthalate: z.string(),
  GramWeight: z
    .string()
    .min(1, { message: "Please enter weight in gram!" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid decimal point number(e.x 0.1, 12.11, 12)",
    }),
  Description: z.string(),
});
