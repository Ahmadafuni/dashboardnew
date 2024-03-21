import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllProductCategoryTwo = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const { data } = await axios.get("productcatalogcategorytwo");
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
        const { data } = await axios.get(`productcatalogcategorytwo/${id}`);
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
        await axios.post("productcatalogcategorytwo", categoryTwoData);
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
        await axios.put(`productcatalogcategorytwo/${id}`, categoryTwoData);
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
        await axios.delete(`productcatalogcategorytwo/${id}`);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
