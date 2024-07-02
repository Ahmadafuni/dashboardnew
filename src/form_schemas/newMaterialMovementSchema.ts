import { z } from "zod";

export const internalMovementSchema = z.object({
  MovementType: z.string().min(1, { message: "Please select movement type!" }),
  ChildMaterial: z.string(),
  Quantity: z
    .string()
    .min(1, { message: "Please enter quantity!" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid decimal point number(e.x 0.1, 12.11, 12)!",
    }),
  UnitOfQuantity: z
    .string()
    .min(1, { message: "Please enter unite of quantity!" }),
  MovementDate: z.date(),
  WarehouseFrom: z.string(),
  WarehouseTo: z.string(),
  DepartmentFrom: z.string(),
  DepartmentTo: z.string(),
});

export const externalMovementSchema = z.object({
  MovementType: z.string().min(1, { message: "Please select movement type!" }),
  ChildMaterial: z.string(),
  Quantity: z
    .string()
    .min(1, { message: "Please enter quantity!" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Please enter a valid decimal point number(e.x 0.1, 12.11, 12)!",
    }),
  UnitOfQuantity: z
    .string()
    .min(1, { message: "Please enter unite of quantity!" }),
  MovementDate: z.date(),
  Warehouse: z.string().min(1, { message: "Please select warehouse!" }),
  Supplier: z.string().min(1, { message: "Please select supplier!" }),
});
