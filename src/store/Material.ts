import { atom } from "recoil";

export const newMaterialModal = atom<boolean>({
  key: "newMaterialModal",
  default: false,
});

export const updateMaterialModal = atom<boolean>({
  key: "updateMaterialModal",
  default: false,
});

export const materialId = atom<number>({
  key: "materialId",
  default: 0,
});

export const material = atom<any>({
  key: "material",
  default: {},
});

export const materialList = atom<any[]>({
  key: "materialList",
  default: [],
});
