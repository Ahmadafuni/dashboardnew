import {MaterialsType} from "@/types/Warehouses/Materials.types.ts";

export type MaterialMovementsType = {
    Id: number;
    MaterialId: MaterialsType;
    FromLocationType: 'Supplier' | 'Department' | 'Warehouse'; // Type of the source location
    FromLocationId: number; // Reference to the ID of the source location (Supplier, Department, Warehouse, etc.)
    ToLocationType: 'Supplier' | 'Department' | 'Warehouse'; // Type of the destination location
    ToLocationId: number; // Reference to the ID of the destination location (Supplier, Department, Warehouse, etc.)
    MovementType: 'Incoming' | 'Outgoing';
    Quantity: number;
    UnitOfMeasure: string;
    Description: string;
}