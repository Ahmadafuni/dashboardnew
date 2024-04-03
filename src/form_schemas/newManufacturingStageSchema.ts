import { z } from "zod";

export const manufacturingStageSchema = z.object({
  department: z.string().min(1, { message: "Department ID is required" }),
  stageName: z.string().min(1, { message: "Stage name is required" }),
  workDescription: z.string(),
  duration: z
    .string()
    .min(1, { message: "Please enter duration!" })
    .regex(/^\d+$/, {
      message: "Please enter a valid integer number(e.x 1, 12)",
    }),
});
