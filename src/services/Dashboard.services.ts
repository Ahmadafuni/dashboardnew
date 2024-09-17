import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const getAllWork = async (
    depId: any,
    pages: {
      awaitingPage: number;
      inProgressPage: number;
      completedPage: number;
      givingConfirmationPage: number;
    },
    sizes: {
      awaitingSize: number;
      inProgressSize: number;
      completedSize: number;
      givingConfirmationSize: number;
    },
    setData: Dispatch<SetStateAction<any>>,
    setTotalPages?: Dispatch<SetStateAction<any>>,
    setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading && setIsLoading(true);
    const { data } = await axios.get("trackingmodels/current/dep", {
      params: {
        ...pages,
        ...sizes,
        depId
      },
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    setData(data.data);
    setTotalPages && setTotalPages(data.totalPages);
    setIsLoading && setIsLoading(false);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getAllTracking = async (
  pages: {
    awaitingPage: number;
    inProgressPage: number;
    completedPage: number;
    givingConfirmationPage: number;
  },
  sizes: {
    awaitingSize: number;
    inProgressSize: number;
    completedSize: number;
    givingConfirmationSize: number;
  },
  setData: Dispatch<SetStateAction<any>>,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading && setIsLoading(true);
    const { data } = await axios.get("trackingmodels/alltracking", {
      params: {
        ...pages,
        ...sizes,
      },
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    console.log(data.data);

    setData(data.data);
    setTotalPages && setTotalPages(data.totalPages);
    setIsLoading && setIsLoading(false);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
export const startVariant = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`trackingmodels/start/variant/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    // @ts-ignore
    getAllWork({}, {}, setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const completeVariant = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`trackingmodels/complete/variant/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    // @ts-ignore
    getAllWork({}, {}, setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const sentForCheckingVariant = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(
      `trackingmodels/sent/checking/variant/${id}`,
      {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      }
    );
    // @ts-ignore
    getAllWork({}, {}, setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const confirmVariant = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`trackingmodels/confirm/variant/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    // @ts-ignore
    getAllWork({}, {}, setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const rejectVariant = async (
  setData: Dispatch<SetStateAction<any>>,
  id: number
) => {
  try {
    const { data } = await axios.get(`trackingmodels/reject/variant/${id}`, {
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    // @ts-ignore
    getAllWork({}, {}, setData);
    toast.success(data.message);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
