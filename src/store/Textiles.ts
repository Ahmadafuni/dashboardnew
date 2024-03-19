import { atom } from "recoil";

export const newTextileModal = atom({
    key: "newTextileModal",
    default: false,
});

export const updateTextileModal = atom({
    key: "updateTextileModal",
    default: false,
});

export const textileId = atom({
    key: "textileId",
    default: 0,
});

export const textile = atom({
    key: "textile",
    default: {
        TextileName: "",
        TextileType: "",
        Composition: "",
        Description: "",
    },
});
