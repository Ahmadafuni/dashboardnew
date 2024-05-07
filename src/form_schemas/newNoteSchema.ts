import { z } from "zod";

export const noteSchema = z.object({
  NoteType: z.string().min(1, { message: "Please select a note type!" }),
  AssignedToDepartmentId: z
    .string()
    .min(1, { message: "Please select a department!" }),
  Description: z
    .string()
    .min(1, { message: "Enter a description for the note!" })
    .max(255),
});
