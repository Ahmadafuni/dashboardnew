import {SizeType} from "@/types/Entities/Size.types.ts";
import {TemplateType} from "@/types/Templates/Templates.types.ts";

export type TemplateSizesType ={
    Id: number;
    TemplateId: TemplateType;
    SizeId: SizeType;
    TemplateSizeType: string;
    Description: string;
}
