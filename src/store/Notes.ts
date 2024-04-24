import { atom } from "recoil";

export const newNoteModal = atom({
    key: "newNoteModal",
    default: false,
});

export const updateNoteModal = atom({
    key: "updateNoteModal",
    default: false,
});

export const noteId = atom({
    key: "noteId",
    default: 0,
});

export const noteData = atom({
    key: "noteData",
    default: {
        NoteType: "",
        AssignedToDepartmentId: 0,
        AssignedToWarehouseId: 0,
        Description: "",
    },
});
