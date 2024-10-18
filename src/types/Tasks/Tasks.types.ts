import { DepartmentType } from "@/types/Departments/Departments.types.ts";

export type TaskType = {
  Id: number;
  TaskName: string;
  DueAt:   Date;
  StartTime:  Date | null;
  EndTime:  Date | null;
  Status: string;
  AssignedToDepartment: DepartmentType;
  CreatedByDepartment: DepartmentType;
  AssignedFile: string;
  Description: string;
  Feedback: string;
};
