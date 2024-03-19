import { atom } from "recoil";

export const newTemplatePatternModal = atom({
    key: "newTemplatePatternModal",
    default: false,
});

export const updateTemplatePatternModal = atom({
    key: "updateTemplatePatternModal",
    default: false,
});

export const templatePatternId = atom({
    key: "templatePatternId",
    default: 0,
});

export const templatePattern = atom({
    key: "templatePattern",
    default: {
        TemplatePatternName: "",
        Description: "",
    },
});
