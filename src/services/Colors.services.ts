import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllColors = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const { data } = await axios.get("color");
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getColorById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`color/${id}`);
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const createColor = async (
    colorData: any
) => {
    try {
        await axios.post("color", colorData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const updateColor = async (
    id: string | undefined,
    colorData: any
) => {
    try {
        await axios.put(`color/${id}`, colorData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteColor = async (
    id: string | undefined
) => {
    try {
        await axios.delete(`color/${id}`);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
