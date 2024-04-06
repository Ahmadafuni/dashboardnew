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
        OrderNumber: "",
        OrderName: "",
        CollectionID: "",
        Amount: 0,
        DeadlineDate: new Date().toISOString().split('T')[0],
        File: "",
        Description:"" ,
    },
});

export const orderList = atom({
    key: "orderList",
    default: [],
});
