import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllModels = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined
) => {
  try {
    const response = await axios.get(`model/all/${id}`);
    setData(response.data.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getModelById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined,
  setSizesList: Dispatch<SetStateAction<any>>
) => {
  try {
    const response = await axios.get(`model/${id}`);
    setData(response.data.data.model);
    setSizesList(response.data.data.sizes);
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
    await axios.delete(`model/${id}`);
    toast.success("Model deleted successfully");
    getAllModels(setData, orderId);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
