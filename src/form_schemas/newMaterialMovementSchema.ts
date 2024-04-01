import { z } from "zod";

export const materialMovementSchema = z.object({
    MaterialId: z.number().min(1),
    FromLocationType: z.string().max(255),
    FromLocationId: z.number().min(1),
    ToLocationType: z.string().max(255),
    ToLocationId: z.number().min(1),
    MovementType: z.string().max(255),
    Quantity: z.number().min(0),
    UnitOfMeasure: z.string().max(255),
    Description: z.string().max(255).optional(),
});
