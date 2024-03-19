import { z } from "zod";

export const newTemplatePatternSchema = z.object({
    TemplatePatternName: z
        .string()
        .min(1, {
            message: "Please enter a pattern name.",
        })
        .max(255, {
            message: "Maximum characters for the pattern name is 255.",
        }),
    Description: z.string().max(255).optional(),
});
