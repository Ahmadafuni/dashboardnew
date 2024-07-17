import { atom } from "recoil";

export const newMaterialModal = atom({
  key: "newMaterialModal",
  default: false,
});

export const updateMaterialModal = atom({
  key: "updateMaterialModal",
  default: false,
});

export const materialId = atom({
  key: "materialId",
  default: 0,
});

export const material = atom({
  key: "material",
  default: {
    Name: "",
    Description: "",
    UnitOfMeasure: "",
    UsageLocation: "",
    AlternativeMaterials: "",
    MinimumLimit: "",
    IsRelevantToProduction: "",
    HasChildren: "",
    Category: "", Id: ""

  },
});

export const materialList = atom({
  key: "materialList",
  default: [],
});
