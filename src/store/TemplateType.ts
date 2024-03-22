import { atom } from "recoil";

export const newTemplateTypeModal = atom({
  key: "newTemplateTypeModal",
  default: false,
});

export const updateTemplateTypeModal = atom({
  key: "updateTemplateTypeModal",
  default: false,
});

export const templateTypeId = atom({
  key: "templateTypeId",
  default: 0,
});

export const templateType = atom({
  key: "templateType",
  default: {
    name: "",
    description: "",
  },
});
