import { atom } from "recoil";

export const newProductCatalogueModal = atom({
  key: "newProductCatalogueModal",
  default: false,
});

export const updateProductCatalogueModal = atom({
  key: "updateProductCatalogueModal",
  default: false,
});

export const productCatalogueId = atom({
  key: "productCatalogueId",
  default: 0,
});
