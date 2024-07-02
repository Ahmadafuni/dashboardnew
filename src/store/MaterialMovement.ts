import { atom } from "recoil";

export const newInternalMovementModal = atom({
  key: "newInternalMovementModal",
  default: false,
});

export const newExternalMovementModal = atom({
  key: "newExternalMovementModal",
  default: false,
});

export const updateMaterialMovementModal = atom({
  key: "updateMaterialMovementModal",
  default: false,
});

export const materialMovementId = atom({
  key: "materialMovementId",
  default: 0,
});

export const materialMovement = atom({
  key: "materialMovement",
  default: {
    MaterialId: 0,
    FromLocationType: "",
    FromLocationId: 0,
    ToLocationType: "",
    ToLocationId: 0,
    MovementType: "",
    Quantity: 0,
    UnitOfMeasure: "",
    Description: "",
  },
});

export const materialMovementList = atom({
  key: "materialMovementList",
  default: [],
});
