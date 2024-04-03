import { atom } from "recoil";

export const manufacturingStages = atom<any[]>({
  key: "manufacturingStages",
  default: [],
});

export const manufacturingStageId = atom({
  key: "manufacturingStageId",
  default: 0,
});

export const manufacturingStage = atom({
  key: "manufacturingStage",
  default: {
    department: "",
    stageName: "",
    workDescription: "",
    duration: "",
  },
});

export const updateManufacturingStageModal = atom({
  key: "updateManufacturingStageModal",
  default: false,
});
