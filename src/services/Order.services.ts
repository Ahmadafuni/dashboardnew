import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllOrders = async (setData: Dispatch<SetStateAction<any>>) => {
  try {
    const response = await axios.get("orders/all", {
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

export const getOrderById = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const response = await axios.get(`orders/${id}`, {
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

export const deleteOrder = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    await axios.delete(`orders/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success("Order deleted successfully");
    getAllOrders(setData);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const startOrder = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    await axios.get(`orders/start/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    toast.success("Order Started successfully!");
    getAllOrders(setData);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};