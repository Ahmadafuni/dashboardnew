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
    default: {
        Name: "",
        Type: "",
        CategoryId: 0,
        Color: "", // Only for specific Category
        MinimumStockLevel: 0,
        MaximumStockLevel: 0,
        UnitOfMeasure: "",
        Location: "",
        Description: ""
    },
});

export const materialList = atom<any[]>({
    key: "materialList",
    default: [],
});
