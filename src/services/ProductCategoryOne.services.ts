import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllProductCategoryOne = async (
  setData: Dispatch<SetStateAction<any>> ,
  pages?: number,
  sizes?: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    if(setIsLoading)setIsLoading(true);

    const { data } = await axios.get("productcatalogcategoryone/all", {
      params: {
        page: pages,
        size: sizes,
      },
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    if (setTotalPages) setTotalPages(data.totalPages);
    setData(data.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const getAllProductCategoryOneList = async (
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    const { data } = await axios.get("productcatalogcategoryone", {
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

export const getProductCategoryOneById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`productcatalogcategoryone/${id}`, {
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

export const createProductCategoryOne = async (categoryOneData: any) => {
  try {
    await axios.post("productcatalogcategoryone", categoryOneData, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const updateProductCategoryOne = async (
  id: number,
  categoryOneData: any
) => {
  try {
    await axios.put(`productcatalogcategoryone/${id}`, categoryOneData, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const deleteProductCategoryOne = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number) => {
  try {
    const { data } = await axios.delete(`productcatalogcategoryone/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllProductCategoryOne(setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
