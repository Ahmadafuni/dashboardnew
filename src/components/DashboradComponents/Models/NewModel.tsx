import ModelForm from "@/components/DashboradComponents/Models/ModelForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { ModelSchema } from "@/form_schemas/newModelSchema.ts";
import { templateList } from "@/store/Template";
import { textileList } from "@/store/Textiles";
import { colorList } from "@/store/Color";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { getAllProductCataloguesList } from "@/services/ProductCatalogues.services";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";
import { getAllTextilesList } from "@/services/Textiles.services";
import { getAllColorsList } from "@/services/Colors.services";
import NewProductCategoryOne from "../Entities/ProductCategoryOne/NewProductCategoryOne";
import NewProductCategoryTwo from "../Entities/ProductCategoryTwo/NewProductCategoryTwo";
import { getAllTemplatesList } from "@/services/Templates.services";
import NewTextiles from "../Entities/Textiles/NewTextiles";
import NewProductCatalogueDialog from "../ProductCatalogue/NewProductCatalogueDialog";
import { useSearchParams,useParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton";

interface Props {
  setNext: Dispatch<SetStateAction<any>>;
}
export default function NewModel({ setNext }: Props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  // @ts-expect-error
  let [searchParams, setSearchParams] = useSearchParams();
  const setTemplates = useSetRecoilState(templateList);
  const setTextile = useSetRecoilState(textileList);
  const setCategoryOne = useSetRecoilState(productCategoryOneList);
  const setCategoryTwo = useSetRecoilState(productCategoryTwoList);
  const setProductCatalogue = useSetRecoilState(productCatalogueList);

  const [files, setFiles] = useState({});
  const handleFileChange = (e: any) => {
    setFiles(e.target.files);
  };

  const form = useForm<z.infer<typeof ModelSchema>>({
    resolver: zodResolver(ModelSchema),
    defaultValues: {
      ProductCatalog: "",
      CategoryOne: "",
      CategoryTwo: "",
      Textile: "",
      Template: "",
      Characteristics: "",
      Barcode: "",
      LabelType: "",
      PrintName: "",
      PrintLocation: "",
      Description: "",
      ReasonText: "",
      DemoModelNumber: "",
    },
  });

  useEffect(() => {}, []);

  const onSubmit = async (data: z.infer<typeof ModelSchema>) => {
    try {
      const formData = new FormData();
      if (Object.keys(files).length > 0) {
        for (let i = 0; i < Object.keys(files).length; i++) {
          // @ts-expect-error
          formData.append("models", files[i]);
        }
      }
      formData.append("DemoModelNumber", data.DemoModelNumber);
      formData.append("ProductCatalog", data.ProductCatalog);
      formData.append("CategoryOne", data.CategoryOne);
      formData.append("CategoryTwo", data.CategoryTwo);
      formData.append("Textile", data.Textile);
      formData.append("Template", data.Template);
      formData.append("Characteristics", data.Characteristics);
      formData.append("Barcode", data.Barcode);
      formData.append("LabelType", data.LabelType);
      formData.append("PrintName", data.PrintName);
      formData.append("PrintLocation", data.PrintLocation);
      formData.append("Description", data.Description);

      console.log("formData are : ", data);

      const newModel = await axios.post(`model/${id}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newModel.data.message);
      setIsLoading(false);
      setSearchParams({ model: newModel.data.data.Id, tab: "details" });
      setNext("details");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    getAllProductCataloguesList(setProductCatalogue);
    getAllProductCategoryOneList(setCategoryOne);
    getAllProductCategoryTwoList(setCategoryTwo);
    getAllTextilesList(setTextile);
    getAllTemplatesList(setTemplates);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewProductCategoryOne
        getProductCategoriesOne={() =>
          getAllProductCategoryOneList(setCategoryOne)
        }
      />
      <NewProductCategoryTwo
        getProductCategoriesTwo={() =>
          getAllProductCategoryTwoList(setCategoryTwo)
        }
      />
      <NewTextiles getTextiles={() => getAllTextilesList(setTextile)} />
      <NewProductCatalogueDialog
        getCatalogues={() => getAllProductCataloguesList(setProductCatalogue)}
      />
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold">{t("NewModel")}</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <ModelForm
          form={form}
          onSubmit={onSubmit}
          handleFileChange={handleFileChange}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} form="model">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("Please wait")}
            </>
          ) : (
            t("Next")
          )}
        </Button>
      </div>
    </div>
  );
}
