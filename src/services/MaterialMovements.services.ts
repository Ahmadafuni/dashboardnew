import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllMaterialMovements = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {

    try {
        const { data } = await axios.get(`materialmovement/all/${id}`, {
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

export const getIncomingMaterialMovements = async (
    setData: Dispatch<SetStateAction<any>>,
) => {

    try {
        const { data } = await axios.get("materialmovement/incoming", {
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

export const getOutgoingMaterialMovements = async (
    setData: Dispatch<SetStateAction<any>>,
) => {

    try {
        const { data } = await axios.get("materialmovement/outgoing", {
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
export const getMaterialMovementById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        const { data } = await axios.get(`materialmovement/${id}`, {
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

export const deleteMaterialMovement = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
    materialId: string | undefined

) => {
    try {
        const { data } = await axios.delete(`materialmovement/${id}`, {
            headers: {
                Authorization: `bearer ${Cookies.get("access_token")}`,
            },
        });
        getAllMaterialMovements(setData, materialId);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
