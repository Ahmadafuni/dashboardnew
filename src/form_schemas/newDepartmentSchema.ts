import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name for the department.",
    })
    .max(50),
  location: z.string().max(255, { message: "Maximum 255 charecters." }),
  description: z.string(),
  category: z.string().min(1, {
    message: "Please select a category for the department.",
  }),
});
// name, location, description, category
