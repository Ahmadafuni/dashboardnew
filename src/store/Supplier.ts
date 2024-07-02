import { atom } from "recoil";

export const newSupplierModal = atom({
  key: "newSupplierModal",
  default: false,
});

export const updateSupplierModal = atom({
  key: "updateSupplierModal",
  default: false,
});

export const supplierId = atom({
  key: "supplierId",
  default: 0,
});

export const supplier = atom({
  key: "supplier",
  default: {
    name: "",
    address: "",
    phone: "",
    description: "",
  },
});

export const supplierList = atom({
  key: "supplierList",
  default: [],
});
