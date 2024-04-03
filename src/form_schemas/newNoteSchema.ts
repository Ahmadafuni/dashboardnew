import { z } from "zod";

export const noteSchema = z.object({
    NoteType: z.string().max(255),
    AssignedToDepartmentId: z.number().int().optional(),
    AssignedToWarehouseId: z.number().int().optional(),
    Description: z.string().max(255),
});