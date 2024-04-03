import { z } from "zod";

export const measurementSchema = z.object({
  SizeId: z.string().min(1, {
    message: "Please enter size.",
  }),
  MeasurementName: z
    .string()
    .min(1, {
      message: "Please enter measurement name.",
    })
    .max(255, {
      message: "Maximum characters for the measurement name is 255.",
    }),
  MeasurementValue: z
    .string()
    .min(1, {
      message: "Please enter measurement value.",
    })
    .max(255, {
      message: "Maximum characters for the measurement value is 255.",
    }),
  MeasurementUnit: z
    .string()
    .min(1, {
      message: "Please enter measurement unit.",
    })
    .max(255, {
      message: "Maximum characters for the measurement unit is 255.",
    }),
});
