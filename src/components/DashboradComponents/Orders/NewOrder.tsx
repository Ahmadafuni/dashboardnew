import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import Cookies from "js-cookie";
import OrderForm from "./OrderForm.tsx";
import { newOrderModal } from "@/store/Orders.ts";
import { OrderSchema } from "@/form_schemas/newOrderSchema.ts";
import NewCollection from "@/components/DashboradComponents/Entities/Collections/NewCollection.tsx";
import { CollectionList } from "@/store/Collection.ts";
import { getAllCollectionsList } from "@/services/Collection.services.ts";

import {  templateList } from "@/store/Template";
import { textileList } from "@/store/Textiles";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { getAllProductCataloguesList } from "@/services/ProductCatalogues.services";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";
import { getAllTextilesList } from "@/services/Textiles.services";

import * as XLSX from "xlsx";
// import { useSearchParams } from "react-router-dom";
import { getAllTemplatesList } from "@/services/Templates.services.ts";
import { getAllColors } from "@/services/Colors.services.ts";
import { ColorType } from "@/types/Entities/Color.types.ts";

type Props = {
  getAllOrders: any;
};

const NewOrder = ({ getAllOrders }: Props) => {
  const [open, setOpen] = useRecoilState(newOrderModal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const setCollectionList = useSetRecoilState(CollectionList);
  const [xslModels, setXslModels] = useState<any[]>([]);

  const [colors , setColors] = useState<ColorType[]>([]);

  // lists
  // let [searchParams, setSearchParams] = useSearchParams();
  const setTemplates = useSetRecoilState(templateList);
  const setTextile = useSetRecoilState(textileList);
  const setCategoryOne = useSetRecoilState(productCategoryOneList);
  const setCategoryTwo = useSetRecoilState(productCategoryTwoList);
  const setProductCatalogue = useSetRecoilState(productCatalogueList);

  // جلب القوائم من Recoil
  const CatalogueList = useRecoilValue(productCatalogueList);
  const categoryOneList = useRecoilValue(productCategoryOneList);
  const categoryTwoList = useRecoilValue(productCategoryTwoList);
  const textilesList = useRecoilValue(textileList);
  const templatesList = useRecoilValue(templateList);




  const renameFields = (data: any[]) => {
    const fieldNamesMap: { [key: string]: string } = {
      "رقم الموديل": "ModelNumber",
      "الصنف": "CategoryOne",
      "الفئة": "CategoryTwo",
      "الزمرة": "ProductName",
      "القماش": "Textiles",
      "رقم القالب": "templateId",
      "مراحل العمل": "Stages",
      "القياس": "scale",
    };

    return data.map((record: any) => {
      let renamedRecord: any = {};
      Object.keys(record).forEach((key) => {
        const newKey = fieldNamesMap[key]?.replace(/\s+/g, "") || key.replace(/\s+/g, "");

        renamedRecord[newKey] = record[key];
      });
      return renamedRecord;
    });
  };


  type Model = {
    ModelNumber: string;
    CategoryOne: string;
    CategoryTwo: string;
    ProductName: string;
    Textiles: string;
    templateId: string;
   
  };

  const replaceNamesWithIds = (
    models: Model[],
    categoryOneList: { value: string; label: string }[],
    categoryTwoList: { value: string; label: string }[],
    textilesList: { value: string; label: string }[],
    // @ts-ignore
    templatesList: { value: string; label: string }[],
    CatalogueList: { value: string; label: string }[]
  ): Model[] | null => {
    const errors: string[] = [];

    const updatedModels = models.map((model) => {
      const categoryOne = categoryOneList.find((item) => item.label === model.CategoryOne);
      if (categoryOne) {
        model.CategoryOne = categoryOne.value;
      } else {
        errors.push(`الصنف  غير موجود لـ ${model.CategoryOne} للموديل '${model.ModelNumber}'....`);
      }

      const categoryTwo = categoryTwoList.find((item) => item.label === model.CategoryTwo);
      if (categoryTwo) {
        model.CategoryTwo = categoryTwo.value;
      } else {
        errors.push(`الفئة غير موجود لـ ${model.CategoryTwo} للموديل '${model.ModelNumber}'....`);
      }

      const product = CatalogueList.find((item) => item.label === model.ProductName);
      if (product) {
        model.ProductName = product.value;
      } else {
        errors.push(`الزمرة غير موجود لـ ${model.ProductName} للموديل '${model.ModelNumber}'....`);
      }

      const textile = textilesList.find((item) => item.label === model.Textiles);
      if (textile) {
        model.Textiles = textile.value;
      } else {
        errors.push(`القماش غير موجود لـ ${model.Textiles} للموديل '${model.ModelNumber}'....`);
      }

      return model;
    });

    if (errors.length > 0) {
      const errorMessage = errors.join("\n");
      toast.error(errorMessage);
      return null;
    }
    return updatedModels;
  };


  const handleXSLUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      let jsonData = XLSX.utils.sheet_to_json<Model>(worksheet);

      jsonData = renameFields(jsonData);

      const updatedJsonData = replaceNamesWithIds(
        jsonData,
        categoryOneList,
        categoryTwoList,
        textilesList,
        templatesList,
        CatalogueList
      );

      if (updatedJsonData === null) {
        return;
      }

      setXslModels(updatedJsonData);

      console.log("xslModels" , xslModels);
    };

    reader.readAsArrayBuffer(file);
  };


  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      collection: "",
      description: "",
      orderName: "",
      quantity: "",
      deadline: new Date().toISOString().split("T")[0], // Initialize with today's date
    },
  });

  const checkModelsDistribution = (models: any[]) => {
    let isValid = true;
    const errors: string[] = [];
    console.log("test");
    models.forEach((model) => {
      const scales = model.scale ? model.scale.split('-') : [];
  
      const arrColors = colors.map((colorObj) => colorObj.ColorName);
  
      arrColors?.forEach((color) => {
        if (model[color]) {
          const quantity = model[color];
          if (scales.length > 0) {
            const quantityPerScale = quantity / scales.length;
            if (!Number.isInteger(quantityPerScale)) {
              errors.push(
                `عدد الموديلات (${quantity}) للون "${color}" لا يمكن تقسيمه على عدد القياسات (${scales.length}) للموديل "${model.ModelNumber}" .... \n`
              );
              isValid = false;
            }
          }
        }
      });
    });
  
    return { isValid, errors };
  };
  


  const onSubmit = async (data: z.infer<typeof OrderSchema>) => {
    setIsLoading(true);
    const errors: string[] = [];

    try {
      const formData = new FormData();
      formData.append("collection", data.collection);
      formData.append("description", data.description);
      formData.append("orderName", data.orderName);
      formData.append("quantity", data.quantity);
      formData.append("deadline", data.deadline);

      if (xslModels.length > 0) {
        const { isValid, errors: distributionErrors } = checkModelsDistribution(xslModels);
        if (!isValid) {
          errors.push(...distributionErrors);
        }

        const allKeys = new Set<string>();

        xslModels.forEach((model) => {
          Object.keys(model).forEach((key) => allKeys.add(key));
        });
        
        const keys = Array.from(allKeys);


      const firstColorIndex = keys.findIndex((key) => key === "أسود");

      if (firstColorIndex !== -1) {
        const colorFields = keys.slice(firstColorIndex);

        const arrColors = colors.map((colorObj) => colorObj.ColorName);

        colorFields.forEach((color) => {
          if (!arrColors.includes(color)) {
            errors.push(`اللون "${color}" الموجود في ملف الاكسل غير موجود في النظام.`);
          }
        });
      } else {
        errors.push("لم يتم العثور على حقل اللون 'أسود' في البيانات.");
      }
      
        const invalidModels = xslModels.filter((model) => !model.ModelNumber);

        if (invalidModels.length > 0) {
          errors.push("يرجى التحقق من البيانات هناك سجلات بدون رقم موديل.");
        }

        const invalidProductName = xslModels.filter((model) => !model.ProductName);
        if (invalidProductName.length > 0) {
          errors.push(`يرجى التحقق من البيانات هناك سجلات بدون صنف للموديل`);
        }

        const invalidCategoryOne = xslModels.filter((model) => !model.CategoryOne);
        if (invalidCategoryOne.length > 0) {
          errors.push("يرجى التحقق من البيانات هناك سجلات بدون فئة.");
        }

        const invalidCategoryTwo = xslModels.filter((model) => !model.CategoryTwo);
        if (invalidCategoryTwo.length > 0) {
          errors.push("يرجى التحقق من البيانات هناك سجلات بدون زمرة.");
        }

        if (errors.length > 0) {
          const errorMessage = errors.join("\n");
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }

        const newOrder = await axios.post("orders", formData, {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        });
        const orderId = newOrder.data.data.Id;
        toast.success(newOrder.data.message);
        const payload = {
          Models: xslModels,
        };

        const multiModel = await axios.post(`/model/addFileXsl/${orderId}`, payload, {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        });
        toast.success(multiModel.data.message);

        getAllOrders();
        form.reset();
        setIsLoading(false);
        setOpen(false);
      } else {
        const newOrder = await axios.post("orders", formData, {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        });

        toast.success(newOrder.data.message);
        getAllOrders();
        form.reset();
        setIsLoading(false);
        setOpen(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    getAllCollectionsList(setCollectionList);
    getAllProductCataloguesList(setProductCatalogue);
    getAllProductCategoryOneList(setCategoryOne);
    getAllProductCategoryTwoList(setCategoryTwo);
    getAllTextilesList(setTextile);
    getAllTemplatesList(setTemplates);

    getAllColors(setColors);

    console.log("color" , colors);

  }, []);


  return (
    <div className="w-full space-y-2">
      <NewCollection getAllCollections={setCollectionList} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("NewOrder")}</DialogTitle>
          </DialogHeader>
          <OrderForm
            form={form}
            onSubmit={onSubmit}
            handleFileChange={handleXSLUpload}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("Close")}
            </Button>
            <Button type="submit" disabled={isLoading} form="order">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Please wait")}
                </>
              ) : (
                t("Add")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewOrder;
