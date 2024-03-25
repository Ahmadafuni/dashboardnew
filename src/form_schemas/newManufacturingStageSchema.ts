import { z } from "zod";

export const manufacturingStageSchema = z.object({
    Id: z.number().int().positive().optional(),
    TemplateId: z.string().min(1, { message: "Template ID is required" }),
    DepartmentId: z.string().min(1, { message: "Department ID is required" }),
    StageNumber: z.number().int().positive().min(1, { message: "Stage number is required" }),
    StageName: z.string().min(1, { message: "Stage name is required" }),
    WorkDescription: z.string(),
    Duration: z.number(),
    Description: z.string(),
});