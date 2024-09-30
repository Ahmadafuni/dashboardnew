import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllOrders = async (
  setData: Dispatch<SetStateAction<any>>,
  pages?: number,
  sizes?: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>

) => {
  try {
    if(setIsLoading)setIsLoading(true);

    const response = await axios.get("orders/all", {
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
  }finally {
    if (setIsLoading) setIsLoading(false);
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
    getAllOrders(setData);
    toast.success("Order Started successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const holdOrder = async (
    setData: Dispatch<SetStateAction<any>>,
    id: number,
    stopData: any
) => {
  try {
    await axios.put(
        `orders/hold/${id}`,
        { stopData },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
    );
    getAllOrders(setData);
    toast.success("Order on hold successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};


export const restartOrder = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    await axios.get(`orders/restart/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    getAllOrders(setData);
    toast.success("Order restarted successfully!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
