import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a supplier name.",
    })
    .max(255, {
      message: "Maximum characters for the supplier name is 255.",
    }),
  address: z.string().max(255, {
    message: "Maximum characters for the  Address is 255.",
  }),
  phone: z
    .string()
    .min(1, {
      message: "Please enter a PhoneNumber.",
    })
    .max(255, {
      message: "Maximum characters for the location is 255.",
    }),
  description: z.string(),
});
