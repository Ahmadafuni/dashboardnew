import { z } from "zod";

export const ModelSchema = z.object({
  ProductCatalog: z
    .string()
    .min(1, { message: "Please select product." }),
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
  ReasonText: z.string(),
  Description: z.string(),
});

export const UpdateModelSchema = z.object({
  ProductCatalog: z
      .string()
      .min(1, { message: "Please select product." }),
  CategoryOne: z.string().min(1, { message: "Please select category one." }),
  CategoryTwo: z.string().min(1, { message: "Please select category two." }),
  Textile: z.string().min(1, { message: "Please select textile." }),
  Template: z.string().min(1, { message: "Please select template." }),
  ModelName: z.string().min(1, { message: "Model name is required." }),
  DemoModelNumber: z.string().min(1, { message: "Please enter model number." }),

  Characteristics: z.any().optional(),
  Barcode: z.any().optional(),
  LabelType: z.any().optional(),
  PrintName: z.any().optional(),
  PrintLocation: z.any().optional(),
  ReasonText: z.any().optional(),
  Description: z.any().optional(),
});

export const ModelVarientSchema = z.object({
  Sizes: z
      .object({ label: z.string(), value: z.string() })
      .array()
      .nonempty({ message: "Select at least one size." }), // Ensure at least one size is selected
  Color: z.string().min(1, { message: "Please select a color." }), // Color is required
  Quantity: z
      .string()
      .min(1, { message: "Please enter total quantity" })
      .regex(/^\d+$/, {
        message: "Please enter a valid integer number (e.g., 1, 12)",
      }),
});