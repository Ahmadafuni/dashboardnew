import { z } from "zod";

export const newMaterialMovementSchema = z.object({
  movementType: z
      .string()
      .min(1, {
        message: "Please select a movement type.",
      }),
  parentMaterialId: z
      .number()
      .refine((value) => value > 0, {
        message: "Please select a parent material.",
      }),
  childMaterialId: z
      .number()
      .optional()
      .refine((value) => !value || value > 0, {
        message: "Please select a valid child material.",
      }),
  quantity: z
      .number()
      .refine((value) => value > 0, {
        message: "Please enter a valid quantity.",
      }),
  unitOfQuantity: z
      .string()
      .min(1, {
        message: "Please enter a unit of quantity.",
      })
      .max(255, {
        message: "Maximum characters for the unit of quantity is 255.",
      }),
  description: z
      .string()
      .max(255, {
        message: "Maximum characters for the description is 255.",
      })
      .optional(),
  movementDate: z.date({
    required_error: "Please enter a movement date.",
  }),
  warehouseFromId: z
      .number()
      .optional()
      .refine((value) => !value || value > 0, {
        message: "Please select a valid warehouse.",
      }),
  warehouseToId: z
      .number()
      .refine((value) => value > 0, {
        message: "Please select a warehouse.",
      }),
  supplierId: z
      .number()
      .optional()
      .refine((value) => !value || value > 0, {
        message: "Please select a valid supplier.",
      }),
  departmentFromId: z
      .number()
      .optional()
      .refine((value) => !value || value > 0, {
        message: "Please select a valid department.",
      }),
  departmentToId: z
      .number()
      .optional()
      .refine((value) => !value || value > 0, {
        message: "Please select a valid department.",
      }),
  modelId: z
      .number()
      .optional()
      .refine((value) => !value || value > 0, {
        message: "Please select a valid model.",
      }),
});
