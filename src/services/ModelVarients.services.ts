import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllModelVarients = async (
  setData: Dispatch<SetStateAction<any>>,
  id: any,
  pages?: number,
  sizes?: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    if (setIsLoading) setIsLoading(true);
    const response = await axios.get(`model/varients/all/${id}`, {
      params: {
        page: pages,
        size: sizes,
      },
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    if (setTotalPages) setTotalPages(response.data.totalPages);
    setData(response.data.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const getModelVarientById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: any
) => {
  try {
    const response = await axios.get(`model/varients/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    setData(response.data.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const deleteModelVarient = async (
  setData: Dispatch<SetStateAction<any>>,
  id: any,
  modelId: any,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    if (setIsLoading) setIsLoading(true);

    const response = await axios.delete(`model/varients/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success(response.data.message);
    if (setIsLoading) setIsLoading(false);
    getAllModelVarients(setData, modelId);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const holdModelVarinte = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number,
  stopData: any,
  modelId: any,
  setIsLoading?: Dispatch<SetStateAction<boolean>>

) => {
  try {
    if (setIsLoading) setIsLoading(true);
    await axios.put(
      `model/model-variants-hold/${id}`,
      { stopData },
      {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      }
    );
    if (setIsLoading) setIsLoading(false);
    // Replace getAllModelVariants with your function to fetch updated model variants data
    getAllModelVarients(setData, modelId);
    toast.success("Model variant on hold successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const restartModelVarinte = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number,
  modelId: any,
  setIsLoading?: Dispatch<SetStateAction<boolean>>

) => {
  try {
    if (setIsLoading) setIsLoading(true);

    await axios.put(
      `model/model-variants-restart/${id}`,
      {},
      {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      }
    );
    if (setIsLoading) setIsLoading(false);

    // Replace getAllModelVariants with your function to fetch updated model variants data
    getAllModelVarients(setData, modelId);
    toast.success("Model variant restarted successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};


export const restartRejectedModel = async (
  trackingId: number,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    if (setIsLoading) setIsLoading(true);

    const response = await axios.get(
      `trackingmodels/restart/${trackingId}`,      
    );
    
    toast.success("تم إعادة تشغيل الموديل بنجاح");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 403) {
        toast.error("ليس لديك الصلاحية لإعادة تشغيل هذا الموديل");
      } else {
        toast.error(error.response?.data.message);
      }
    }
    throw error;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};