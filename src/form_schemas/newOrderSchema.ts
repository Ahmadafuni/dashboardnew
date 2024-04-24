import { z } from "zod";

export const OrderSchema = z.object({
  orderName: z.string().min(1, {
    message: "Please enter a name for the order.",
  }),
  collection: z.string().min(1, {
    message: "Please select a collection.",
  }),
  quantity: z
    .string()
    .min(1, { message: "Please enter duration!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
  deadline: z.any(),
  description: z.string(),
});
// orderName, amount, collection, description, deadline, quantity;
