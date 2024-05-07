import { atom } from "recoil";

export const newModelModal = atom({
  key: "newModelModal",
  default: false,
});

export const updateModelModal = atom({
  key: "updateModelModal",
  default: false,
});

export const modelId = atom({
  key: "modelId",
  default: 0,
});

export const model = atom({
  key: "model",
  default: {
    ProductCatalog: "",
    CategoryOne: "",
    CategoryTwo: "",
    Textile: "",
    Template: "",
    ModelName: "",
    Characteristics: "",
    Barcode: "",
    LabelType: "",
    PrintName: "",
    PrintLocation: "",
    Description: "",
    DemoModelNumber: "",
  },
});

export const modelList = atom({
  key: "modelList",
  default: [],
});

export const modelVarientNew = atom({
  key: "modelVarientNew",
  default: [],
});
