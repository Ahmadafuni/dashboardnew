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
    // ProductCatalog: 0,
    // CategoryOne: 0,
    // CategoryTwo: 0,
    Textile: "",
    Template: "",
    TotalQuantity: "",
    Quantity: "",
    ModelName: "",
    Size: "",
    Color: "",
    Characteristics: "",
    Barcode: "",
    LabelType: "",
    PrintName: "",
    PrintLocation: "",
    Description: "",
  },
});

export const modelList = atom({
  key: "modelList",
  default: [],
});

export const modelVarientNew = atom({
  key: "",
  default: [],
});
