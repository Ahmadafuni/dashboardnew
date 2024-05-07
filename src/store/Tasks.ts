import { atom } from "recoil";

export const newTaskModal = atom({
  key: "newTaskModal",
  default: false,
});

export const updateTaskModal = atom({
  key: "updateTaskModal",
  default: false,
});

export const submitTaskModal = atom({
  key: "submitTaskModal",
  default: false,
});

export const checkSubmittedTaskModal = atom({
  key: "checkSubmittedTaskModal",
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
    DueDate: new Date(),
    AssignedToDepartmentId: "",
    Description: "",
  },
});

export const feedbackId = atom({
  key: "feedbackId",
  default: 0,
});

export const feedbackData = atom({
  key: "feedbackData",
  default: {
    Feedback: "",
    FeedbackFile: "",
  },
});
