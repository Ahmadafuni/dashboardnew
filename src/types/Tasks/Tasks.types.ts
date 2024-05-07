import { DepartmentType } from "@/types/Departments/Departments.types.ts";

export type TaskType = {
  Id: number;
  TaskName: string;
  DueAt: string;
  Status: string;
  AssignedToDepartment: DepartmentType;
  AssignedFile: string;
  Description: string;
  Feedback: string;
};
