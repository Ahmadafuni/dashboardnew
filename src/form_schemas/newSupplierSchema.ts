import { z } from "zod";

export const supplierSchema = z.object({
    Name: z
        .string()
        .min(1, {
            message: "Please enter a supplier name.",
        })
        .max(255, {
            message: "Maximum characters for the supplier name is 255.",
        }),
    Address: z
        .string()
        .min(1, {
            message: "Please enter Address.",
        })
        .max(255, {
            message: "Maximum characters for the  Address is 255.",
        }),
    PhoneNumber: z
        .string()
        .min(1, {
            message: "Please enter a PhoneNumber.",
        })
        .max(255, {
            message: "Maximum characters for the location is 255.",
        }),
    email: z.string().max(255).optional(),
    Description: z.string().max(255).optional(),
});
