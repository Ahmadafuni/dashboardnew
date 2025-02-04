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

export const productCatalogue = atom({
  key: "productCatalogue",
  default: {
    name: "",
    description: "",
  },
});

export const productCatalogueList = atom({
  key: "productCatalogueList",
  default: [],
});
