import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllTemplatePatterns = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const { data } = await axios.get("templatepattern");
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getTemplatePatternById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`templatepattern/${id}`);
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const createTemplatePattern = async (
    templatePatternData: any
) => {
    try {
        await axios.post("templatepattern", templatePatternData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const updateTemplatePattern = async (
    id: string | undefined,
    templatePatternData: any
) => {
    try {
        await axios.put(`templatepattern/${id}`, templatePatternData);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const deleteTemplatePattern = async (
    id: string | undefined
) => {
    try {
        await axios.delete(`templatepattern/${id}`);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};