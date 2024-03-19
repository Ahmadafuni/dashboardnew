import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllProductCategoryTwo = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const { data } = await axios.get("productcategorytwo");
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getProductCategoryTwoById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`productcategorytwo/${id}`);
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const createProductCategoryTwo = async (
    categoryTwoData: any
) => {
    try {
        await axios.post("productcategorytwo", categoryTwoData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const updateProductCategoryTwo = async (
    id: string | undefined,
    categoryTwoData: any
) => {
    try {
        await axios.put(`productcategorytwo/${id}`, categoryTwoData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteProductCategoryTwo = async (
    id: string | undefined
) => {
    try {
        await axios.delete(`productcategorytwo/${id}`);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
