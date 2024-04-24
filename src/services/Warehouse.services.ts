import axios, {AxiosError} from "axios";
import Cookies from "js-cookie";
import {Dispatch, SetStateAction} from "react";
import {toast} from "sonner";

export const getAllWarehouses = async (
    setData: Dispatch<SetStateAction<any[]>>,
) => {
    try {
        const {data} = await axios.get("warehouse/all", {
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

export const getWarehouseById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        const {data} = await axios.get(`warehouse/${id}`, {
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

export const deleteWarehouse = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
) => {
    try {
        const {data} = await axios.delete(`warehouse/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
        getAllWarehouses(setData);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
