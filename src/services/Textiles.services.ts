import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllTextiles = async (
  setData: Dispatch<SetStateAction<any>> ,
  pages?: number,
  sizes?: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>

) => {
  try {
    if(setIsLoading)setIsLoading(true);
    const { data } = await axios.get("productcatalogtextile/all", {
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
  }finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const getAllTextilesList = async (
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    const { data } = await axios.get("productcatalogtextile", {
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

export const getTextileById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`productcatalogtextile/${id}`, {
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

export const createTextile = async (textileData: any) => {
  try {
    await axios.post("productcatalogtextile", textileData, {
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

export const updateTextile = async (
  id: string | undefined,
  textileData: any
) => {
  try {
    await axios.put(`productcatalogtextile/${id}`, textileData, {
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

export const deleteTextile = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number) => {
  try {
    const { data } =  await axios.delete(`productcatalogtextile/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllTextiles(setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
