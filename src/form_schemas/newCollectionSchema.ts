import { z } from "zod";

export const CollectionSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Please enter a collection name (1-50 characters)" })
        .max(50, { message: "Please enter a collection name (1-50 characters)" })
        .refine((value) => value.trim().length > 0, {
            message: "Please enter a collection name (1-50 characters)",
        }),
    description: z.string().max(255).optional(),
});
