import { atom } from "recoil";

export const newProductCategoryOneModal = atom({
    key: "newProductCategoryOneModal",
    default: false,
});

export const updateProductCategoryOneModal = atom({
    key: "updateProductCategoryOneModal",
    default: false,
});

export const productCategoryOneId = atom({
    key: "productCategoryOneId",
    default: 0,
});

export const productCategoryOne = atom({
    key: "productCategoryOne",
    default: {
        ProductCatalogCategoryOne: "",
        Description: "",
    },
});
