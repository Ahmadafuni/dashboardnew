import {CollectionType} from "@/types/Entities/Collections.types.ts";

export type OrderType = {
    Id: number;
    OrderNumber: string; // generated from Backend
    OrderName: string;
    CollectionID: CollectionType;
    Quantity: number;
    DeadlineDate: Date;
    File: string; // .xlsx
    Description: string;
};
