import { CollectionType } from "@/types/Entities/Collections.types.ts";

export type OrderType = {
  Id: number;
  OrderNumber: string; // generated from Backend
  OrderName: string;
  Collection: CollectionType;
  Quantity: number;
  DeadlineDate: Date;
  FilePath: string; // .xlsx
  Description: string;
  Status: string;
};
