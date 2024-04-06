import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllOrders = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const response = await axios.get("orders/all");
        setData(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getOrderById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        const response = await axios.get(`orders/${id}`);
        setData(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteOrder = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        await axios.delete(`orders/${id}`);
        toast.success("Order deleted successfully");
        getAllOrders(setData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
