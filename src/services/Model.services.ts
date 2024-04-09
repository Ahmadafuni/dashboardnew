import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllModels = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined

) => {
    try {
        const response = await axios.get(`models/all/${id}`);
        setData(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getModelById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        const response = await axios.get(`models/${id}`);
        setData(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteModel = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
    orderId: string | undefined
) => {
    try {
        await axios.delete(`models/${id}`);
        toast.success("Model deleted successfully");
        getAllModels(setData, orderId);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
