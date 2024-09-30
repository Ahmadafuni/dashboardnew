import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllProductCategoryTwo = async (
  setData: Dispatch<SetStateAction<any>> ,
  pages?: number,
  sizes?: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    if(setIsLoading)setIsLoading(true);

    const { data } = await axios.get("productcatalogcategorytwo/all", {
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

export const getAllProductCategoryTwoList = async (
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    const { data } = await axios.get("productcatalogcategorytwo", {
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

export const getProductCategoryTwoById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`productcatalogcategorytwo/${id}`, {
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

export const createProductCategoryTwo = async (categoryTwoData: any) => {
  try {
    await axios.post("productcatalogcategorytwo", categoryTwoData, {
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

export const updateProductCategoryTwo = async (
  id: string | undefined,
  categoryTwoData: any
) => {
  try {
    await axios.put(`productcatalogcategorytwo/${id}`, categoryTwoData, {
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

export const deleteProductCategoryTwo = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number) => {
  try {
    const { data } =  await axios.delete(`productcatalogcategorytwo/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllProductCategoryTwo(setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
