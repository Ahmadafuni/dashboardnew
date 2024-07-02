import { z } from "zod";

export const warehouseSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a warehouse name.",
    })
    .max(255, {
      message: "Maximum characters for the warehouse name is 255.",
    }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  location: z
    .string()
    .min(1, {
      message: "Please enter a location.",
    })
    .max(255, {
      message: "Maximum characters for the location is 255.",
    }),
  capacity: z.string().min(1, { message: "Please enter warehouse capacity!" }),
  description: z.string(),
});
