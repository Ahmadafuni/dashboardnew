import { atom } from "recoil";

export const newOrderModal = atom({
  key: "newOrderModal",
  default: false,
});

export const updateOrderModal = atom({
  key: "updateOrderModal",
  default: false,
});

export const orderId = atom({
  key: "orderId",
  default: 0,
});

export const order = atom({
  key: "order",
  default: {
    collection: "",
    description: "",
    orderName: "",
    quantity: "",
    deadline: new Date().toISOString().split("T")[0],
  },
});

export const orderList = atom({
  key: "orderList",
  default: [],
});
