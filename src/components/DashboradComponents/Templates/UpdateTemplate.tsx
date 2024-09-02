import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateSchema } from "@/form_schemas/newTemplateSchema";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { getTemplateById } from "@/services/Templates.services";
import TemplateForm from "./TemplateForm";
import { useSetRecoilState } from "recoil";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { templatePatternList } from "@/store/TemplatePattern";
import { templateTypeList } from "@/store/TemplateType";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";
import { getAllTemplatePatternsList } from "@/services/TemplatePattern.services";
import { getAllTemplateTypesList } from "@/services/TemplateType.services";
import { getAllProductCataloguesList } from "@/services/ProductCatalogues.services";
import NewProductCategoryOne from "../Entities/ProductCategoryOne/NewProductCategoryOne";
import NewProductCategoryTwo from "../Entities/ProductCategoryTwo/NewProductCategoryTwo";
import NewTemplatePattern from "../Entities/TemplatePattern/NewTemplatePattern";
import NewTemplateType from "../Entities/TemplateType/NewTemplateType";
import {useTranslation} from "react-i18next";

export default function UpdateTemplate() {
  const { templateId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  // Current Template
  const [currentTemplate, setCurrentTemplate] = useState({});
  // Dropdown state
  const setCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setTemplatePatternList = useSetRecoilState(templatePatternList);
  const setTemplateTypeList = useSetRecoilState(templateTypeList);
  const setProductCatalogueList = useSetRecoilState(productCatalogueList);
  // File
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  const form = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      category1: "",
      category2: "",
      season: "",
      templatePattern: "",
      templateType: "",
      productCatalog: "",
    },
    values: currentTemplate,
  });
  const onSubmit = async (data: z.infer<typeof templateSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file !== null) {
        formData.append("template", file);
      }
      formData.append("description", data.description);
      formData.append("name", data.name);
      formData.append("category1", data.category1);
      formData.append("category2", data.category2);
      formData.append("season", data.season);
      formData.append("templatePattern", data.templatePattern);
      formData.append("templateType", data.templateType);
      formData.append("productCatalog", data.productCatalog);
      console.log(formData.get("name"));

      const response = await axios.put(`template/${templateId}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
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
    getTemplateById(setCurrentTemplate, templateId);
    getAllProductCategoryOneList(setCategoryOneList);
    getAllProductCategoryTwoList(setCategoryTwoList);
    getAllTemplatePatternsList(setTemplatePatternList);
    getAllTemplateTypesList(setTemplateTypeList);
    getAllProductCataloguesList(setProductCatalogueList);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewProductCategoryOne
        getProductCategoriesOne={() =>
          getAllProductCategoryOneList(setCategoryOneList)
        }
      />
      <NewProductCategoryTwo
        getProductCategoriesTwo={() =>
          getAllProductCategoryTwoList(setCategoryTwoList)
        }
      />
      <NewTemplatePattern
        getTemplatePatterns={() =>
          getAllTemplatePatternsList(setTemplatePatternList)
        }
      />
      <NewTemplateType
        getTemplateTypes={() => getAllTemplateTypesList(setTemplateTypeList)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("UpdateTemplate")}</h1>
        <Separator />
      </div>
      <div className="space-y-1">
        <TemplateForm
          form={form}
          onSubmit={onSubmit}
          handleFileChange={handleFileChange}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="template">
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
