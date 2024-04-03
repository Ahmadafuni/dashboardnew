import {DepartmentType} from "@/types/Departments/Departments.types.ts";
import {TemplateType} from "@/types/Templates/Templates.types.ts";

export type manufacturingStagesType = {
    Id: number;
    TemplateId: TemplateType;
    DepartmentId: DepartmentType;
    StageNumber: number;
    StageName: string;
    WorkDescription: string;
    Duration: number;
    Description: number;
}