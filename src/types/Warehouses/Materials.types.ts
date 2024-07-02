import { MaterialCategoryType } from "@/types/Warehouses/MaterialCategory.types.ts";

export type MaterialType = {
  Id: number;
  Name: string;
  Description: string | null;
  UnitOfMeasure: string | null;
  UsageLocation: string | null;
  AlternativeMaterials: string | null;
  MinimumLimit: number | null;
  IsRelevantToProduction: boolean;
  HasChildren: boolean;
  Category: MaterialCategoryType;
};

export type ChildMaterialType = {
  Id: number;
  Name: string;
  Description: string | null;
  DyeNumber: string | null;
  Kashan: string | null;
  Halil: string | null;
  Phthalate: string | null;
  GramWeight: number | null;
  ParentMaterial: MaterialType;
};
