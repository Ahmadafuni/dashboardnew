import { atom } from "recoil";

export const newColorModal = atom({
    key: "newColorModal",
    default: false,
});

export const updateColorModal = atom({
    key: "updateColorModal",
    default: false,
});

export const colorId = atom({
    key: "colorId",
    default: 0,
});

export const color = atom({
    key: "color",
    default: {
        name: "",
        code: "",
        description: "",
    },
});
