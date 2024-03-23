import { z } from "zod";

export const ProductCategoryTwoSchema = z.object({
    ProductCatalogCategoryTwo: z
        .string()
        .min(1, { message: "Please enter a category name (1-50 characters)" })
        .max(50, { message: "Please enter a category name (1-50 characters)" })
        .refine(value => value.trim().length > 0, {
            message: "Please enter a category name (1-50 characters)"
        }),
    Description: z.string().max(255).optional()
});
