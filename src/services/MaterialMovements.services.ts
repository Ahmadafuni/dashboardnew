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

export const getMaterialMovementsByMovementType = async (
    setData: Dispatch<SetStateAction<any>>,
    type: string
) => {
    try {
        const { data } = await axios.get(`materialmovement/movementtype/${type}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
        setData(data.data);
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

export const deleteMaterialMovement = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
    movementType: string
) => {
    try {
        const { data } = await axios.delete(`materialmovement/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
        getMaterialMovementsByMovementType(setData, movementType);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
