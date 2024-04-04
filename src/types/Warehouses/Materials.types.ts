import {MaterialCategoryType} from "@/types/Warehouses/MaterialCategory.types.ts";

export type MaterialType = {
    Id: number;
    Name: string;
    Type: string;
    CategoryId: MaterialCategoryType;
    Color: string; // only for specific Category
    MinimumStockLevel: number;
    MaximumStockLevel: number;
    UnitOfMeasure: string;
    Location: string;
    Description: string;
}