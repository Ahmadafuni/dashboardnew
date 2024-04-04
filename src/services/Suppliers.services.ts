import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllSuppliers = async (setData: Dispatch<SetStateAction<any[]>>) => {
    try {
        const { data } = await axios.get("supplier/all", {
            headers: {
                Authorization: `bearer ${Cookies.get("access_token")}`,
            },
        });
        setData(data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getSupplierById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        const { data } = await axios.get(`supplier/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
        setData(data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteSupplier = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
) => {
    try {
        const { data } = await axios.delete(`supplier/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
        getAllSuppliers(setData);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
