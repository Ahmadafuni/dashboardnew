import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllMeasurements = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined,
  type: string
) => {
  try {
    const { data } = await axios.get(`measurements/all/${id}/${type}`, {
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

export const deleteMeasurement = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number,
  templateId: string | undefined,
  type: string
) => {
  try {
    const { data } = await axios.delete(`measurements/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllMeasurements(setData, templateId, type);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getMeasurementById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`measurements/${id}`, {
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

export const createMultipleMeasurements = async (data: any) => {
  try {
    const newMeasurements = await axios.post("templatesize", data, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success(newMeasurements.data.message);
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
    return false;
  }
};
