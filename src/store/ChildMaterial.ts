import { atom } from "recoil";

export const newChildMaterialModal = atom({
    key: "newChildMaterialModal",
    default: false,
});

export const updateChildMaterialModal = atom({
    key: "updateChildMaterialModal",
    default: false,
});

export const childMaterialId = atom({
    key: "childMaterialId",
    default: 0,
});

export const childMaterial = atom({
    key: "childMaterial",
    default: {
        Name: "",
        DyeNumber: "",
        Kashan: "",
        Halil: "",
        Phthalate: "",
        GramWeight: "",
        Description: "",
    },
});

export const childMaterialList = atom({
    key: "childMaterialList",
    default: [],
});
