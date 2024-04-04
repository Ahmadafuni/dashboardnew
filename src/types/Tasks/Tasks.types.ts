import {DepartmentType} from "@/types/Departments/Departments.types.ts";
import {WarehouseType} from "@/types/Warehouses/Warehouses.types.ts";

export type TaskType ={
    Id: number;
    TaskName: string;
    ImplementationDate: Date;
    Status: string;
    AssignedToDepartmentId: DepartmentType;
    AssignedToWarehouseId: WarehouseType;
    Description: string;
}