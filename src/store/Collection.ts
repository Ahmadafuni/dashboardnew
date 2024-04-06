import { atom } from "recoil";

export const newCollectionModal = atom({
    key: "newCollectionModal",
    default: false,
});

export const updateCollectionModal = atom({
    key: "updateCollectionModal",
    default: false,
});

export const CollectionId = atom({
    key: "CollectionId",
    default: 0,
});

export const Collection = atom({
    key: "Collection",
    default: {
        name: "",
        description: "",
    },
});

export const CollectionList = atom({
    key: "CollectionList",
    default: [],
});
