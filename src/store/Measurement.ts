import { atom } from "recoil";

export const newMeasurementModal = atom({
  key: "newMeasurementModal",
  default: false,
});

export const updateMeasurementModal = atom({
  key: "updateMeasurementModal",
  default: false,
});

export const measurement = atom({
  key: "measurement",
  default: {
    MeasurementName: "",
    MeasurementUnit: "",
    MeasurementValue: "",
    SizeId: "",
  },
});

export const measurementId = atom({
  key: "measurementId",
  default: 0,
});

export const measurementsGroup = atom({
  key: "measurementsGroup",
  default: {},
});
