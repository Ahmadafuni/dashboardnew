import { atom } from "recoil";

export const newMaterialCategoryModal = atom({
  key: "newMaterialCategoryModal",
  default: false,
});

export const updateMaterialCategoryModal = atom({
  key: "updateMaterialCategoryModal",
  default: false,
});

export const materialCategoryId = atom({
  key: "materialCategoryId",
  default: 0,
});

export const materialCategory = atom({
  key: "materialCategory",
  default: {
    name: "",
    description: "",
  },
});

export const materialCategoryList = atom({
  key: "materialCategoryList",
  default: [],
});
