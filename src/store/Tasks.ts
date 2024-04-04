import { atom } from "recoil";

export const newTaskModal = atom({
    key: "newTaskModal",
    default: false,
});

export const updateTaskModal = atom({
    key: "updateTaskModal",
    default: false,
});

export const taskId = atom({
    key: "taskId",
    default: 0,
});

export const taskData = atom({
    key: "taskData",
    default: {
        TaskName: "",
        ImplementationDate: new Date(),
        Status: "",
        AssignedToDepartmentId: 0,
        AssignedToWarehouseId: 0,
        Description: "",
    },
});
