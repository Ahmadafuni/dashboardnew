import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllTemplateSizes = async (
  setData: Dispatch<SetStateAction<any>>,
  id: string | undefined
) => {
  try {
    const { data } = await axios.get(`templatesize/all/${id}`, {
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

export const getTemplateSizeById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`templatesize/${id}`, {
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

export const createTemplateSize = async (
  templateId: number,
  templateSizeData: any
) => {
  try {
    await axios.post(`templatesize/${templateId}`, templateSizeData, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success("Template size created successfully");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const updateTemplateSize = async (
  templateId: number,
  templateSizeId: number,
  templateSizeData: any
) => {
  try {
    await axios.put(
      `templatesize/${templateId}/${templateSizeId}`,
      templateSizeData,
      {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      }
    );
    toast.success("Template size updated successfully");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const deleteTemplateSize = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number,
  templateId: string | undefined
) => {
  try {
    const { data } = await axios.delete(`templatesize/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllTemplateSizes(setData, templateId);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
