import { z } from "zod";

export const newMaterialMovementSchema = z.object({
    movementType: z.string().optional(),
    invoiceNumber: z.string().optional(),
    parentMaterialId: z.string().min(1, { message: "Please select a parent material." }),
    childMaterialId: z.string().optional(),
    quantity: z.string().min(1, { message: "Please enter a valid quantity." }).regex(/^\d+$/, { message: "Please enter a valid quantity." }),
    unitOfQuantity: z.string().min(1, { message: "Please enter a unit of quantity." }).max(255, { message: "Maximum characters for the unit of quantity is 255." }),
    description: z.string().max(255, { message: "Maximum characters for the description is 255." }).optional(),
    movementDate: z.date({ required_error: "Please enter a movement date." }),
    warehouseFromId: z.string().optional(),
    warehouseToId: z.string().optional(),
    supplierId: z.string().optional(),
    departmentFromId: z.string().optional(),
    departmentToId: z.string().optional(),
    modelId: z.string().optional(),
});
