import { z } from "zod";

export const taskSchema = z.object({
    TaskName: z
        .string()
        .min(1, { message: "Please enter a task name!" })
        .max(255)
        .refine((value) => value.trim().length > 0, {
            message: "Please enter a task name (1-255 characters)!",
        }),
    ImplementationDate: z.date(),
    Status: z.string().max(255).optional(),
    AssignedToDepartmentId: z.number().int().optional(),
    AssignedToWarehouseId: z.number().int().optional(),
    Description: z.string().max(255).optional(),
});
