import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllMaterials = async (setData: Dispatch<SetStateAction<any[]>>) => {
    try {
        const { data } = await axios.get("material/all", {
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

export const getMaterialById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`material/${id}`, {
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

export const deleteMaterial = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
) => {
    try {
        const { data } = await axios.delete(`material/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
        getAllMaterials(setData);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
