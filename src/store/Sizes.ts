import { atom } from "recoil";

export const newSizeModal = atom({
  key: "newSizeModal",
  default: false,
});

export const updateSizeModal = atom({
  key: "updateSizeModal",
  default: false,
});

export const sizeId = atom({
  key: "sizeId",
  default: 0,
});

export const size = atom({
  key: "size",
  default: {
    sizeName: "",
    description: "",
  },
});
