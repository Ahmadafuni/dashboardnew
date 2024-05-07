import { DepartmentType } from "@/types/Departments/Departments.types.ts";

export type NoteType = {
  Id: number;
  NoteType: string; //enum General, Reminder, Attention
  AssignedToDepartment: DepartmentType;
  Description: string;
};
