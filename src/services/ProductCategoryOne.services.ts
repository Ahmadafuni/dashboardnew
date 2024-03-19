import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllProductCategoryOne = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const { data } = await axios.get("productcategoryone");
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getProductCategoryOneById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`productcategoryone/${id}`);
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const createProductCategoryOne = async (
    categoryOneData: any
) => {
    try {
        await axios.post("productcategoryone", categoryOneData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const updateProductCategoryOne = async (
    id: string | undefined,
    categoryOneData: any
) => {
    try {
        await axios.put(`productcategoryone/${id}`, categoryOneData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteProductCategoryOne = async (
    id: string | undefined
) => {
    try {
        await axios.delete(`productcategoryone/${id}`);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
