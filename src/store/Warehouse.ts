import { atom } from "recoil";

export const newWarehouseModal = atom({
  key: "newWarehouseModal",
  default: false,
});

export const updateWarehouseModal = atom({
  key: "updateWarehouseModal",
  default: false,
});

export const warehouseId = atom({
  key: "warehouseId",
  default: 0,
});

export const warehouse = atom({
  key: "warehouse",
  default: {
    capacity: "",
    category: "",
    location: "",
    name: "",
    description: "",
  },
});

export const warehouseList = atom({
  key: "warehouseList",
  default: [],
});
