import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getModelsByOrderId = async (
  setData: Dispatch<SetStateAction<any>>,
  id?: string | undefined
) => {
  try {
    const response = await axios.get(`model/all/${id}`, {
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

export const getAllModel = async (
    setData: Dispatch<SetStateAction<any>>,
) => {
  try {
    const response = await axios.get("/model/allmodels", {
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

export const getModelById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined
) => {
  try {
    const response = await axios.get(`model/${id}`, {
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

export const deleteModel = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number,
  orderId: string | undefined
) => {
  try {
    await axios.delete(`model/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success("Model deleted successfully");
    getModelsByOrderId(setData, orderId);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getModelSummary = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined
) => {
  try {
    const response = await axios.get(`model/model-summary/${id}`, {
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

export const holdModel = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
    reasonText: string
) => {
  try {
    await axios.put(
        `model/hold/${id}`,
        { reasonText },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
    );
    // Replace getAllModels with your function to fetch updated models data
    getAllModel(setData);
    toast.success("Model on hold successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const restartModel = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number
) => {
  try {
    await axios.put(
        `model/restart/${id}`,
        {},
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
    );
    // Replace getAllModels with your function to fetch updated models data
    getAllModel(setData);
    toast.success("Model restarted successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
