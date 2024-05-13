import { z } from "zod";

export const materialSchema = z.object({
    Id: z.number()
        .int()
        .min(1, {
            message: "Please enter a valid material ID.",
        }),
    Name: z.string()
        .min(1, {
            message: "Please enter a material name.",
        })
        .max(255, {
            message: "Maximum characters for the material name is 255.",
        }),
    Type: z.string()
        .min(1, {
            message: "Please enter a material type.",
        })
        .max(255, {
            message: "Maximum characters for the material type is 255.",
        }),
    CategoryId: z.number().optional(),
    Color: z.string().optional(),
    MinimumStockLevel: z.number().optional(),
    MaximumStockLevel: z.number().optional(),
    UnitOfMeasure: z.string()
        .min(1, {
            message: "Please enter a unit of measure.",
        })
        .max(255, {
            message: "Maximum characters for the unit of measure is 255.",
        }),
    Location: z.string()
        .min(0)
        .max(255, {
            message: "Maximum characters for the location is 255.",
        }),
    Description: z.string()
        .min(0)
        .max(255, {
            message: "Maximum characters for the description is 255.",
        }),
});