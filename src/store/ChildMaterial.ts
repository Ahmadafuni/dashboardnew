import { atom } from "recoil";

export const newChildMaterialModal = atom<boolean>({
    key: "newChildMaterialModal",
    default: false,
});

export const updateChildMaterialModal = atom<boolean>({
    key: "updateChildMaterialModal",
    default: false,
});

export const childMaterialId = atom<number>({
    key: "childMaterialId",
    default: 0,
});

export const childMaterial = atom<any>({
    key: "childMaterial",
    default: {},
});

export const childMaterialList = atom<any[]>({
    key: "childMaterialList",
    default: [],
});
