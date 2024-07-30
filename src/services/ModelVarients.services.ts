import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllModelVarients = async (
  setData: Dispatch<SetStateAction<any>>,
  id: any
) => {
  try {
    const response = await axios.get(`model/varients/all/${id}`, {
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
  modelId: any
) => {
  try {
    const response = await axios.delete(`model/varients/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success(response.data.message);
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
    reasonText: string,
    modelId: any

) => {
  try {
        await axios.put(
        `model/model-variants-hold/${id}`,
        { reasonText },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
    );
    // Replace getAllModelVariants with your function to fetch updated model variants data
    getAllModelVarients(setData,modelId);
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
    modelId: any

) => {
  try {
    await axios.put(
        `model/model-variants-restart/${id}`,
        {},
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
    );
    // Replace getAllModelVariants with your function to fetch updated model variants data
    getAllModelVarients(setData,modelId);
    toast.success("Model variant restarted successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
