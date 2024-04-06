import { z } from "zod";

export const OrderSchema = z.object({
    OrderNumber: z.string(),
    OrderName: z.string().min(1, {
        message: "Please enter a name for the order.",
    }),
    CollectionID: z.string().min(1, {
        message: "Please select a collection.",
    }),
    Quantity: z.number().min(0, {
        message: "Quantity must be a positive number.",
    }),
    DeadlineDate: z.any(),
    File: z.string().regex(/\.xlsx$/, {
        message: "File must be in .xlsx format.",
    }),
    Description: z.string().optional(),
});
