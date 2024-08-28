import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllCollections = async (
  isArchived: boolean,
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    const response = await axios.get("collections/all", {
      params: {
        isArchived,
      },
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

export const toggleArchivedCollectionById = async (
  id: number,
  toggle: boolean
) => {
  console.log("clicked");

  try {
    const response = await axios.get("collections/update-archived", {
      params: {
        id,
        toggle,
      },
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });

    console.log("response", response);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getAllCollectionsList = async (
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    const response = await axios.get("collections", {
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

export const getCollectionById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const response = await axios.get(`collections/${id}`, {
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

export const deleteCollection = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    await axios.delete(`collections/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success("Collection deleted successfully");
    getAllCollections(setData);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
