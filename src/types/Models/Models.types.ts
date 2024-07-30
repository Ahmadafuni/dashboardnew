import { ProductCatalogueType } from "@/types/ProductCatalogues/ProductCatalogues.types.ts";
import { ProductCategoryOneType } from "@/types/Entities/ProductCategoryOne.types.ts";
import { TextilesType } from "@/types/Entities/Textiles.types.ts";
import { TemplateType } from "@/types/Templates/Templates.types.ts";
// import { SizeType } from "@/types/Entities/Size.types.ts";
// import { ColorType } from "@/types/Entities/Color.types.ts";

export type ModelTypes = {
  Id: number;
  OrderNumber: string;
  ProductCatalog: ProductCatalogueType;
  CategoryOne: ProductCategoryOneType;
  categoryTwo: ProductCategoryOneType;
  Textile: TextilesType;
  Template: TemplateType; //Template Id not Template Type Id
  // Size: SizeType; // can select many sizes
  // Color: ColorType; // can select many colors

  DemoModelNumber: string; // generated from Backend but the user can change it
  ModelNumber: string; // generated from Backend but the user can change it
  ModelName: string; // generated from Backend =ProductCatalogName + CategoryOneName   but the user can change it
  // TotalQuantity: number;
  // Quantity: number;

  Characteristics: string;
  Barcode: string;
  LabelType: string;
  PrintName: string;
  PrintLocation: string;
  Images: string; // I want to store many images
  Status: string; // From backend
  Description: string;
  RunningStatus: string;
};
