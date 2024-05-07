import { z } from "zod";

export const taskSchema = z.object({
  TaskName: z
    .string()
    .min(1, { message: "Please enter a task name!" })
    .max(255)
    .refine((value) => value.trim().length > 0, {
      message: "Please enter a task name (1-255 characters)!",
    }),
  DueDate: z.date(),
  AssignedToDepartmentId: z
    .string()
    .min(1, { message: "Please select a department!" }),
  Description: z.string().max(255),
});

export const feedbackSchema = z.object({
  Feedback: z.string().min(1, { message: "Please enter feedback!" }),
});
