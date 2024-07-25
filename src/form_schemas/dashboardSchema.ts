import { z } from "zod";

export const rejectVariantSchema = z.object({
  Notes: z.string().min(1, { message: "Please write a note!" }),
  DamagedItem: z
    .string()
    .min(1, { message: "Please enter damaged/missing item quantity!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
});

export const pauseUnpuaseReasoneSchema = z.object({
  Reasone: z.string().min(1, { message: "Please write a reasone!" }),
});
export const cuttingSendConfirmationSchema = z.object({
    ClothCount: z.string().optional(),
    ClothLength: z.string().optional(),
    ClothWeight: z.string().optional(),
    ClothWidth: z.string().optional(),
    Notes: z.string().optional(),
    QuantityInKg: z.string().optional(),
    ReplacedItemInKG: z.string().optional(),
    DamagedItem: z.array(z.object({ size: z.string(), value: z.string() })).optional(),
    QuantityInNum: z.array(z.object({ size: z.string(), value: z.string() })).optional(),
});
export const othersSendConfirmationSchema = z.object({
    QuantityReceived: z.array(z.object({ size: z.string(), value: z.string() })).optional(),
    QuantityDelivered: z.array(z.object({ size: z.string(), value: z.string() })).optional(),
    DamagedItem: z.array(z.object({ size: z.string(), value: z.string() })).optional(),
    Notes: z.string(),
});
