import { ProductCategoryOneType } from "../Entities/ProductCategoryOne.types";
import { TemplatePatternType } from "../Entities/TemplatePattern.types";
import { TemplateTypeType } from "../Entities/TemplateType.types";
import { TextilesType } from "../Entities/Textiles.types";

export type ProductCatalogueDetailType = {
  Id: number;
  CategoryOne: ProductCategoryOneType;
  CategoryTwo: ProductCategoryOneType;
  Description: string;
  Grammage: string;
  StandardWeight: string;
  Season: string;
  TemplatePattern: TemplatePatternType;
  TemplateType: TemplateTypeType;
  Textile: TextilesType;
};
