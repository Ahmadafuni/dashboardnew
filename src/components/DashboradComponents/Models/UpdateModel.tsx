import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UpdateModelSchema } from "@/form_schemas/newModelSchema.ts";
import { getModelById } from "@/services/Model.services.ts";
import { model } from "@/store/Models.ts";
import UpdateModelForm from "./UpdateModelForm";
import { getAllTextilesList } from "@/services/Textiles.services";
import { getAllColorsList } from "@/services/Colors.services";
import { getAllTemplatesList } from "@/services/Templates.services";
import { templateList } from "@/store/Template";
import { textileList } from "@/store/Textiles";
import { colorList } from "@/store/Color";
import NewTextiles from "../Entities/Textiles/NewTextiles";
import NewColor from "../Entities/Colors/NewColor";
import { sizeList } from "@/store/Sizes";

export default function UpdateModel() {
  // Translation
  const { t } = useTranslation();

  // Param
  const { modelId } = useParams();

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Recoil state
  const [currentModel, setCurrentModel] = useRecoilState(model);
  const setTemplates = useSetRecoilState(templateList);
  const setTextile = useSetRecoilState(textileList);
  const setColor = useSetRecoilState(colorList);
  const setSizesList = useSetRecoilState(sizeList);
  //   const setCategoryOne = useSetRecoilState(productCategoryOneList);
  //   const setCategoryTwo = useSetRecoilState(productCategoryTwoList);
  //   const setProductCatalogue = useSetRecoilState(productCatalogueList);
  // Files
  const [files, setFiles] = useState({});
  const handleFileChange = (e: any) => {
    setFiles(e.target.files);
  };

  // Form fields
  const form = useForm<z.infer<typeof UpdateModelSchema>>({
    resolver: zodResolver(UpdateModelSchema),
    defaultValues: {
      // ProductCatalog: 0,
      // CategoryOne: 0,
      // CategoryTwo: 0,
      Textile: "",
      Template: "",
      TotalQuantity: "",
      Quantity: "",
      ModelName: "",
      Size: "",
      Color: "",
      Characteristics: "",
      Barcode: "",
      LabelType: "",
      PrintName: "",
      PrintLocation: "",
      Description: "",
    },
    values: currentModel,
  });

  // Form submit function
  const onSubmit = async (data: z.infer<typeof UpdateModelSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (Object.keys(files).length > 0) {
        for (let i = 0; i < Object.keys(files).length; i++) {
          // @ts-expect-error
          formData.append("models", files[i]);
        }
      }

      formData.append("Textile", data.Textile);
      formData.append("Template", data.Template);
      formData.append("TotalQuantity", data.TotalQuantity);
      formData.append("Size", data.Size);
      formData.append("Color", data.Color);
      formData.append("Characteristics", data.Characteristics);
      formData.append("Barcode", data.Barcode);
      formData.append("LabelType", data.LabelType);
      formData.append("PrintName", data.PrintName);
      formData.append("PrintLocation", data.PrintLocation);
      formData.append("Description", data.Description);
      formData.append("Quantity", data.Quantity);
      formData.append("ModelName", data.ModelName);

      const updateModel = await axios.put(`model/${modelId}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(updateModel.data.message);
      getModelById(setCurrentModel, modelId, setSizesList);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    // getAllProductCataloguesList(setProductCatalogue);
    // getAllProductCategoryOneList(setCategoryOne);
    // getAllProductCategoryTwoList(setCategoryTwo);
    getAllTextilesList(setTextile);
    getAllColorsList(setColor);
    getAllTemplatesList(setTemplates);
    getModelById(setCurrentModel, modelId, setSizesList);
  }, []);

  return (
    <div className="w-full space-y-2">
      {/* <NewProductCategoryOne
        getProductCategoriesOne={() =>
          getAllProductCategoryOneList(setCategoryOne)
        }
      />
      <NewProductCategoryTwo
        getProductCategoriesTwo={() =>
          getAllProductCategoryTwoList(setCategoryTwo)
        }
      /> */}
      <NewTextiles getTextiles={() => getAllTextilesList(setTextile)} />
      {/* <NewProductCatalogueDialog
        getCatalogues={() => getAllProductCataloguesList(setProductCatalogue)}
      /> */}
      <NewColor getColors={() => getAllColorsList(setColor)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Update Model</h1>
        <Separator />
      </div>
      <div className="space-y-1">
        <UpdateModelForm
          form={form}
          onSubmit={onSubmit}
          handleFileChange={handleFileChange}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="model-update">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              t("Update")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
