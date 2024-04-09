import { z } from "zod";

export const ModelSchema = z.object({
    OrderID: z.number(),
    ProductCatalogID: z.number(),
    CategoryOne: z.number(),
    CategoryTwo: z.number(),
    Textile: z.number(),
    TemplateID: z.number(),
    TotalQuantity: z.number().min(0, {
        message: "Quantity must be a positive number.",
    }),
    ModelNumber: z.string().min(1, {
        message: "Please enter a model number.",
    }),
    ModelName: z.string().min(1, {
        message: "Please enter a model name.",
    }),
    Sizes: z.array(z.string()).min(1, {
        message: "Please select at least one size.",
    }),
    Colors: z.array(z.string()).min(1, {
        message: "Please select at least one color.",
    }),
    Characteristics: z.string().optional(),
    Barcode: z.string().optional(),
    LabelType: z.string().optional(),
    PrintName: z.string().optional(),
    PrintLocation: z.string().optional(),
    Images: z.any().optional(),
    Description: z.string().optional(),
});
