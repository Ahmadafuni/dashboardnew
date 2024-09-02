import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const createMultipleStageModel = async (data: any) => {
  try {
    const newStages = await axios.post("manufacturingstagemodel/multi", data, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success(newStages.data.message);
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
    return false;
  }
};

export const getAllStageModel = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined
) => {
  try {
    const { data } = await axios.get(`manufacturingstagemodel/all/${id}`, {
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

export const getStagesIdModel = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`manufacturingstagemodel/${id}`, {
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

export const toggleStageUpModel = async (id: number) => {
  try {
    const { data } = await axios.get(`manufacturingstagemodel/toggleup/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const toggleStageDownModel = async (id: number) => {
  try {
    const { data } = await axios.get(`manufacturingstagemodel/toggledown/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const deleteStageModel = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number,
  templateId: string | undefined
) => {
  try {
    const { data } = await axios.delete(`manufacturingstagemodel/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllStageModel(setData, templateId);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
