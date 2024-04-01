import { z } from "zod";

export const materialMovementSchema = z.object({
    MaterialId: z.number().min(1),
    FromLocationType: z.enum(['Supplier', 'Department', 'Warehouse']),
    FromLocationId: z.number().min(1),
    ToLocationType: z.enum(['Supplier', 'Department', 'Warehouse']),
    ToLocationId: z.number().min(1),
    MovementType: z.enum(['Incoming', 'Outgoing']),
    Quantity: z.number().min(0),
    UnitOfMeasure: z.string().max(255),
    Description: z.string().max(255).optional(),
});
