import { ReportsType } from "@/types/Reports/ProductionReports.types";
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

export const getAllModel = async (setData: Dispatch<SetStateAction<any>>) => {
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
  stopData: any
) => {
  try {
    await axios.put(
      `model/hold/${id}`,
      { stopData },
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

export const getAllDropdownOptions = async () => {
  try {
    const response = await axios.get("reports/getAlldata", {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch dropdown options:", error);
    throw error;
  }
};

export const filterModels = async (
  setData: Dispatch<SetStateAction<any>>,
  searchParams: any
) => {
  try {
    const response = await axios.post("model/search", searchParams, {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });

    const reports = response.data.data.flatMap((item: any) =>
      item.Details.map((detail: any, index: number) => {
        return {
          modelId: item.ModelId,
          collectionId: item.CollectionId,
          modelStats: index === 0 ? item.ModelStats : "",
          modelProgress: index === 0 ? item.ModelProgress : "skip",
          orderStats: index === 0 ? item.OrderStats : "",
          orderProgress: index === 0 ? item.OrderProgress : "skip",
          modelName: index === 0 ? item.ModelName : "",
          demoModelNumber: index === 0 ? item.DemoModelNumber : "",
          productCatalogues: index === 0 ? item.ProductCatalog : "",
          productCategoryOne: index === 0 ? item.CategoryOne : "",
          productCategoryTwo: index === 0 ? item.CategoryTwo : "",
          textiles: index === 0 ? item.Textiles : "",
          detailColor: detail.Color,
          sizes: JSON.parse(detail.Sizes).map(
            (size: { size: string; value: string }) =>
              size.size + " : " + size.value
          ),
          currentStage: detail.Quantity.StageName,
          detailQuantity: Object.entries(detail.Quantity.QuantityDelivered)
            .map(([key, value]) => `${key} : ${value}`)
            .join(" , "),
          totalDurationInDays: index === 0 ? item.TotalDurationInDays : "",
          action: index === 0 ? item.Action : "",
        };
      })
    );

    setData(reports);
  } catch (error) {
    console.error("Failed to fetch report results:", error);
    throw error;
  }
};

export const filterProductionModels = async (
  setData: Dispatch<SetStateAction<any>>,
  searchParams: any,
  pages: number,
  sizes: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    if (setIsLoading) setIsLoading(true);

    const response = await axios.post(
      "model/search",
      { ...searchParams },
      {
        params: {
          page: pages,
          size: sizes,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    );

    const responseData: ReportsType = response.data;

    const reports = Array.isArray(responseData.data)
      ? responseData.data.flatMap((item) =>
          item.Details.map((detail) => {
            return {
              modelNumber: item.DemoModelNumber,
              barcode: item.Barcode,
              name:
                item.ProductCatalog +
                "-" +
                item.CategoryOne +
                "-" +
                item.CategoryTwo,
              textile: item.Textiles,
              colors: detail.Color,
              sizes: JSON.parse(detail.Sizes).map(
                (size: { size: string; value: string }) =>
                  size.size + " : " + size.value
              ),
              currentStage: detail.Quantity.StageName,
              quantities: detail.Quantity.QuantityDelivered
                ? // @ts-ignore
                  detail.Quantity.QuantityDelivered.map(
                    (size: { size: string; value: string }) =>
                      `${size.size} : ${size.value}`
                  ).join(" , ")
                : [],

              duration: item.TotalDurationInDays,
            };
          })
        )
      : [];

    setData(reports);
    if (setTotalPages) setTotalPages(responseData.totalPages);
  } catch (error) {
    console.error("Failed to fetch report results:", error);
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const filterOrderModels = async (
  setData: Dispatch<SetStateAction<any>>,
  searchParams: any,
  pages: number,
  sizes: number,
  setTotalPages?: Dispatch<SetStateAction<any>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading && setIsLoading(true);

    const response = await axios.post(
      "model/search",
      { ...searchParams },
      {
        params: {
          page: pages,
          size: sizes,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    );

    const responseData: ReportsType = response.data;

    const reports = responseData.data.flatMap((item) =>
      item.Details.map((detail) => {
        return {
          modelNumber: item.DemoModelNumber,
          barcode: item.Barcode,
          collection: item.CollectionName,
          order: item.OrderName,
          name:
            item.ProductCatalog +
            "-" +
            item.CategoryOne +
            "-" +
            item.CategoryTwo,
          textile: item.Textiles,
          colors: detail.Color,
          sizes: JSON.parse(detail.Sizes).map(
            (size: { size: string; value: string }) =>
              size.size + " : " + size.value
          ),
          quantities: detail.Quantity.QuantityDelivered
            ? // @ts-ignore
              detail.Quantity.QuantityDelivered.map(
                (size: { size: string; value: string }) =>
                  `${size.size} : ${size.value}`
              ).join(" , ")
            : [],
          currentStage: detail.Quantity.StageName,
          modelStatus: item.ModelStatus,
        };
      })
    );

    console.log(reports);
    setData(reports);
    setTotalPages && setTotalPages(responseData.totalPages);
    setIsLoading && setIsLoading(false);
  } catch (error) {
    console.error("Failed to fetch report results:", error);
    throw error;
  }
};

export const getModelsStats = async (
  setData: Dispatch<SetStateAction<any>>,
  type: string
) => {
  try {
    const response = await axios.get("model/model-stats", {
      params: type,
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });

    console.log("Models Stats Are : ", response.data);

    setData(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getOrdersStats = async (
  setData: Dispatch<SetStateAction<any>>,
  type: string
) => {
  try {
    const response = await axios.get("model/orders-stats", {
      params: type,
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    console.log("Orders Stats Are : ", response.data);

    setData(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getCollectionsStats = async (
  setData: Dispatch<SetStateAction<any>>,
  type: string
) => {
  try {
    const response = await axios.get("model/collections-stats", {
      params: type,
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    console.log("Collections Stats Are : ", response.data);

    setData(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getTasksStats = async (
  setData: Dispatch<SetStateAction<any>>,
  type: string
) => {
  try {
    const response = await axios.get("model/tasks-stats", {
      params: type,
      headers: {
        Authorization: `bearer ${Cookies.get("access_token")}`,
      },
    });
    console.log("Tasks Stats Are : ", response.data);

    setData(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
};
