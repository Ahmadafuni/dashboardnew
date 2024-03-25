import { atom } from "recoil";

export const updateTemplateModal = atom({
  key: "updateTemplateModal",
  default: false,
});

export const templateId = atom({
  key: "templateId",
  default: 0,
});

export const template = atom({
  key: "template",
  default: {
    name: "",
    description: "",
  },
});
