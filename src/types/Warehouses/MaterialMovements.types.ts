import {MaterialType} from "@/types/Warehouses/Materials.types.ts";

export type MaterialMovementType = {
    Id: number;
    MaterialId: MaterialType;
    FromLocationType: string;
    FromLocationId: number; // Reference to the ID of the source location (Supplier, Department, Warehouse, etc.)
    ToLocationType: string
    ToLocationId: number; // Reference to the ID of the destination location (Supplier, Department, Warehouse, etc.)
    MovementType: string;
    Quantity: number;
    UnitOfMeasure: string;
    Description: string;
}