import { atom } from "recoil";

export const newModelVarientModal = atom({
  key: "newModelVarientModal",
  default: false,
});

export const updateModelVarientModal = atom({
  key: "updateModelVarientModal",
  default: false,
});

export const currentModelVarient = atom({
  key: "currentModelVarient",
  default: {
    Color: "",
    Sizes: [],
    Quantity: "",
  },
});

export const currentModelVarientId = atom({
  key: "currentModelVarientId",
  default: 0,
});
