type Model = {
  Id: number;
  ModelName: string;
  ModelNumber: string;
  DemoModelNumber: string;
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
  ModelVariant: ModelVariant;
  StartTime: Date | null;
  RunningStatus: string;
  QuantityInNum: number | null;
  MainStatus: "AWAITING" | "TODO" | "INPROGRESS" | "DONE" | "CHECKING";
  DamagedItem: string;
  QuantityDelivered: string;
  QuantityReceived: string;
  QuantityInKg: string;
  PrevStage: string;
};

export type WorkType = {
  awaiting: Tracking[];
  inProgress: Tracking[];
  completed: Tracking[];
  givingConfirmation: Tracking[];
};
