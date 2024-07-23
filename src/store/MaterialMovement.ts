import { atom } from "recoil";

// Modal state for creating a new material movement
export const newMaterialMovementModal = atom({
  key: "newMaterialMovementModal",
  default: false,
});

// Modal state for updating an existing material movement
export const updateMaterialMovementModal = atom({
  key: "updateMaterialMovementModal",
  default: false,
});

// Atom to store the selected material movement ID
export const materialMovementId = atom({
  key: "materialMovementId",
  default: 0,
});

// Atom to store the material movement details
export const materialMovement = atom({
  key: "materialMovement",
  default: {
    movementType: "",
    invoiceNumber: "",
    parentMaterialId: 0,
    childMaterialId: 0,
    quantity: 0,
    unitOfQuantity: "",
    description: "",
    movementDate: new Date(),
    warehouseFromId: 0,
    warehouseToId: 0,
    supplierId: 0,
    departmentFromId: 0,
    departmentToId: 0,
    modelId: 0,
  },
});

// Atom to store the list of material movements
export const materialMovementList = atom({
  key: "materialMovementList",
  default: [],
});
