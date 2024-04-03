export type TemplateSizesType = {
  Id: number;
  Name: string;
  Template: TemplateType;
  Size: SizeType;
  TemplateSizeType: string;
  Description: string;
};

type TemplateType = {
  Id: number;
  TemplateName: string;
};

type SizeType = {
  Id: number;
  SizeName: string;
};
