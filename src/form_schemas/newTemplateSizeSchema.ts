import { z } from "zod";

export const templateSizeSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name!" }),
  size: z.string().min(1, { message: "Please select a Size!" }),
  templateSizeType: z
    .string()
    .min(1, { message: "You need to select a template size type." }),
  description: z.string(),
});

// name, templateSizeType, size, description
