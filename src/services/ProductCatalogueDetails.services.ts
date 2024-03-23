import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllProductCatalogueDetails = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`productcatalogtdetail/all/${id}`, {
            headers: {
                Authorization: `bearer ${Cookies.get("access_token")}`,
            },
        });
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};


export const getProductCatalogueDetailById = async (
    setData: Dispatch<SetStateAction<any>>,
    id: string | undefined
) => {
    try {
        const { data } = await axios.get(`productcatalogtdetail/${id}`, {
            headers: {
                Authorization: `bearer ${Cookies.get("access_token")}`,
            },
        });
        setData(data.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};


export const deleteProductCatalogueDetail = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
    catalogueId: string | undefined
) => {
    try {
        const { data } =  await axios.delete(`productcatalogtdetail/${id}`, {
            headers: {
                Authorization: `bearer ${Cookies.get("access_token")}`,
            },
        });
        getAllProductCatalogueDetails(setData, catalogueId);
        toast.success(data.message);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};
