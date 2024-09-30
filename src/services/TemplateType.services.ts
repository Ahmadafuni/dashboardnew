import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllTemplateTypes = async (
  setData: Dispatch<SetStateAction<any>> ,
  pages?: number,
  sizes?: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>

) => {
  try {
    if(setIsLoading)setIsLoading(true);

    const { data } = await axios.get("templatetype/all", {
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

export const getAllTemplateTypesList = async (
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    const { data } = await axios.get("templatetype", {
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

export const getTemplateTypeById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`templatetype/${id}`, {
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

export const createTemplateType = async (templateTypeData: any) => {
  try {
    await axios.post("templatetype", templateTypeData, {
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

export const updateTemplateType = async (id: number, templateTypeData: any) => {
  try {
    await axios.put(`templatetype/${id}`, templateTypeData, {
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

export const deleteTemplateType = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number) => {
  try {
    const { data } = await axios.delete(`templatetype/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllTemplateTypes(setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
