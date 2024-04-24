import { ProductCategoryOneType } from "../Entities/ProductCategoryOne.types";
import { TemplatePatternType } from "../Entities/TemplatePattern.types";
import { TemplateTypeType } from "../Entities/TemplateType.types";

export type TemplateType = {
  Id: number;
  TemplateName: string;
  Description: string;
  FilePath: string;
  Season: string;
  CategoryOne: ProductCategoryOneType;
  CategoryTwo: ProductCategoryOneType;
  TemplatePattern: TemplatePatternType;
  TemplateType: TemplateTypeType;
  ProductCatalogue: ProductCatalog;
};

// type ProductCatalogueDetailType = {
//   Id: number;
//   ProductCatalog: ProductCatalog;
// };
type ProductCatalog = {
  Id: number;
  ProductCatalogName: string;
};
