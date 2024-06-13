type Model = {
  Id: number;
  ModelName: string;
  ModelNumber: string;
};

type Color = {
  ColorName: string;
};

type ModelVariant = {
  Id: number;
  Sizes: string;
  Quantity: number;
  Model: Model;
  Color: Color;
};

type Tracking = {
  Id: number;
  Notes: string | null;
  DamagedItem: number | null;
  ModelVariant: ModelVariant;
  StartTime: Date | null;
  RunningStatus: string;
  QuantityInNum: number | null;
  MainStatus: "AWAITING" | "TODO" | "INPROGRESS" | "DONE" | "CHECKING";
  QuantityDelivered: number | null;
};

export type WorkType = {
  awaiting: Tracking[];
  inProgress: Tracking[];
  completed: Tracking[];
  givingConfirmation: Tracking[];
};
