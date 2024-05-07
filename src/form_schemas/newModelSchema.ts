import { z } from "zod";

export const ModelSchema = z.object({
  ProductCatalog: z
    .string()
    .min(1, { message: "Please select product catalogue." }),
  CategoryOne: z.string().min(1, { message: "Please select category one." }),
  CategoryTwo: z.string().min(1, { message: "Please select category two." }),
  Textile: z.string().min(1, { message: "Please select textile." }),
  Template: z.string().min(1, { message: "Please select template." }),
  DemoModelNumber: z.string().min(1, { message: "Please enter model number." }),
  Characteristics: z.string(),
  Barcode: z.string(),
  LabelType: z.string(),
  PrintName: z.string(),
  PrintLocation: z.string(),
  Description: z.string(),
});

export const UpdateModelSchema = z.object({
  ProductCatalog: z
    .string()
    .min(1, { message: "Please select product catalogue." }),
  CategoryOne: z.string().min(1, { message: "Please select category one." }),
  CategoryTwo: z.string().min(1, { message: "Please select category two." }),
  Textile: z.string().min(1, { message: "Please select textile." }),
  Template: z.string().min(1, { message: "Please select template." }),
  ModelName: z.string().min(1, { message: "Model name is required." }),
  DemoModelNumber: z.string().min(1, { message: "Please enter model number." }),
  Characteristics: z.string(),
  Barcode: z.string(),
  LabelType: z.string(),
  PrintName: z.string(),
  PrintLocation: z.string(),
  Description: z.string(),
});

export const ModelVarientSchema = z.object({
  Sizes: z
    .object({ label: z.string(), value: z.string() })
    .array()
    .nonempty({ message: "Select at least one size." }),
  Color: z.string().min(1, { message: "Please select a color." }),
  Quantity: z
    .string()
    .min(1, { message: "Please enter total quantity" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
});
