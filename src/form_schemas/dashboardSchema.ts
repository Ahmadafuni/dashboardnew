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
  StopData: z.any(),
});
export const cuttingSendConfirmationSchema = z.object({
  ClothGroups: z
    .array(
      z.object({
        ClothCount: z.string().nonempty("ClothCount is required."),
        ClothLength: z.string().nonempty("ClothLength is required."),
        ClothWeight: z.string().nonempty("ClothWeight is required."),
        ClothWidth: z.string().nonempty("ClothWidth is required."),
        QuantityInKg: z.string().nonempty("QuantityInKg is required."),
        ReplacedItemInKG: z.string().nonempty("Replaced Item In KG is required."),
        ClothPiecesPerPeriod: z.string().nonempty("Cloth Pieces Per Period is required."),
      })
    )
    .min(1, "At least one ClothGroup is required."),
  Notes: z.string().optional(),
  DamagedItem: z
    .array(
      z.object({
        size: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  QuantityInNum: z
    .array(
      z.object({
        size: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const othersSendConfirmationSchema = z.object({
    QuantityReceived: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    QuantityDelivered: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    DamagedItem: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    Notes: z.string(),
});
