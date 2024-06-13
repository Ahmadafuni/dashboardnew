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
  QuantityInKg: z.string(),
  ClothLength: z.string(),
  ClothWidth: z.string(),
  ClothWeight: z.string(),
  ClothCount: z
    .string()
    .min(1, { message: "Please enter cloth count!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
  DamagedItem: z
    .string()
    .min(1, { message: "Please enter damaged item quantity!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
  ReplacedItemInKG: z.string(),
  Notes: z.string(),
  QuantityInNum: z
    .string()
    .min(1, { message: "Please enter quantity in number!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
});

export const othersSendConfirmationSchema = z.object({
  QuantityReceived: z
    .string()
    .min(1, { message: "Please enter received quantity!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
  DamagedItem: z
    .string()
    .min(1, { message: "Please enter damaged item quantity!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
  QuantityDelivered: z
    .string()
    .min(1, { message: "Please enter delivered quantity!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
  Notes: z.string(),
});

// QuantityReceived  Int?
//   QuantityDelivered Int?
//   DamagedItem       Int?                 @default(0)
//   ReplacedItemInKG  String?
//   ClothCount        Int?
//   QuantityInKg      String?
//   ClothLength       String?
//   ClothWidth        String?
//   ClothWeight       String?
//   QuantityInNum     Int?
//   Notes             String?
