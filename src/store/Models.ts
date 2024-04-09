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
        Id: 0,
        OrderID: 0,
        ProductCatalogID: 0,
        CategoryOne: 0,
        CategoryTwo: 0,
        Textile: 0,
        TemplateID: 0,
        TotalQuantity: 0,
        ModelNumber: "",
        ModelName: "",
        Sizes: [],
        Colors: [],
        Characteristics: "",
        Barcode: "",
        LabelType: "",
        PrintName: "",
        PrintLocation: "",
        Images: [],
        Description: "",
    },
});

export const modelList = atom({
    key: "modelList",
    default: [],
});
