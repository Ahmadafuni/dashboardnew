import {DepartmentType} from "@/types/Departments/Departments.types.ts";
import {WarehouseType} from "@/types/Warehouses/Warehouses.types.ts";

export type NoteType ={
    Id: number;
    NoteType: string; //enum General, Reminder, Attention
    AssignedToDepartmentId: DepartmentType;
    AssignedToWarehouseId: WarehouseType;
    Description: string;
}