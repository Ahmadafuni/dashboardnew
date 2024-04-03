import { UUID } from "crypto";
import { atom } from "recoil";

export const newMeasurements = atom<newMeasurementsType[]>({
  key: "newMeasurements",
  default: [],
});

export const newMeasurementsNext = atom<newMeasurementsNextType[]>({
  key: "newMeasurementsNext",
  default: [],
});

export const templateSizeId = atom({
  key: "templateSizeId",
  default: 0,
});

export const updateTemplateSizeModal = atom({
  key: "updateTemplateSizeModal",
  default: false,
});

export const templateSize = atom({
  key: "templateSize",
  default: {
    description: "",
    name: "",
    size: "",
    templateSizeType: "",
  },
});

type newMeasurementsType = {
  Id: UUID;
  MeasurementName: string;
  MeasurementValue: string;
  MeasurementUnit: string;
};

type newMeasurementsNextType = {
  Id: UUID;
  SizeId: string;
  Size: string;
  MeasurementName: string;
  MeasurementValue: string;
  MeasurementUnit: string;
};
