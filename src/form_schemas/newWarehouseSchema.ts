import { z } from "zod";


export const warehouseSchema = z.object({
    WarehouseName: z
        .string()
        .min(1, {
            message: "Please enter a warehouse name.",
        })
        .max(255, {
            message: "Maximum characters for the warehouse name is 255.",
        }),
    CategoryName: z
        .string()
        .min(1, {
            message: "Please enter a category name.",
        })
        .max(255, {
            message: "Maximum characters for the category name is 255.",
        }),
    Location: z
        .string()
        .min(1, {
            message: "Please enter a location.",
        })
        .max(255, {
            message: "Maximum characters for the location is 255.",
        }),
    Capacity: z.number().positive({
        message: "Capacity must be a positive number.",
    }),
    Description: z.string().max(255).optional(),
});
