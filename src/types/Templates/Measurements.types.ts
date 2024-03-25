import {TemplateSizesType} from "@/types/Templates/TemplateSizes.types.ts";

export type MeasurementsType ={
    Id: number;
    TemplateSizeId: TemplateSizesType;
    MeasurementName: string;
    MeasurementValue: string;
    MeasurementUnit: string;
}