import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllTasks = async (
    setData: Dispatch<SetStateAction<any>>
) => {
    try {
        const { data } = await axios.get("tasks/all", {
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

export const getTaskById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
) => {
    try {
        const { data } = await axios.get(`/tasks/${id}`, {
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


export const deleteTask = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
    try {
        const { data } = await axios.delete(`/tasks/${id}`, {
            headers: {
                Authorization: `bearer ${Cookies.get("access_token")}`,
            },
        });
        getAllTasks(setData);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
