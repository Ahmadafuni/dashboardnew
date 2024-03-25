export type TemplateType = {
  Id: number;
  TemplateName: string;
  Description: string;
  FilePath: string;
  ProductCatalogDetail: ProductCatalogueDetailType;
};

type ProductCatalogueDetailType = {
  Id: number;
  ProductCatalog: ProductCatalog;
};
type ProductCatalog = {
  Id: number;
  ProductCatalogName: string;
};
