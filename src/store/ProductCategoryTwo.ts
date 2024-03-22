import { atom } from "recoil";

export const newProductCategoryTwoModal = atom({
  key: "newProductCategoryTwoModal",
  default: false,
});

export const updateProductCategoryTwoModal = atom({
  key: "updateProductCategoryTwoModal",
  default: false,
});

export const productCategoryTwoId = atom({
  key: "productCategoryTwoId",
  default: 0,
});

export const productCategoryTwo = atom({
  key: "productCategoryTwo",
  default: {
    name: "",
    description: "",
  },
});
