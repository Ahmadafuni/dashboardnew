import { Button } from "@/components/ui/button";
import {
  templateSchema,
} from "@/form_schemas/newTemplateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import TemplateForm from "./TemplateForm";
import { useSetRecoilState } from "recoil";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";
import { productCatalogueList } from "@/store/ProductCatalogue.ts";
import { getAllProductCataloguesList } from "@/services/ProductCatalogues.services.ts";
import { getAllTemplatePatternsList } from "@/services/TemplatePattern.services";
import { getAllTemplateTypesList } from "@/services/TemplateType.services";
import { templatePatternList } from "@/store/TemplatePattern";
import { templateTypeList } from "@/store/TemplateType";
import NewProductCategoryOne from "../Entities/ProductCategoryOne/NewProductCategoryOne";
import NewProductCategoryTwo from "../Entities/ProductCategoryTwo/NewProductCategoryTwo";
import NewTemplatePattern from "../Entities/TemplatePattern/NewTemplatePattern";
import NewTemplateType from "../Entities/TemplateType/NewTemplateType";
import {useTranslation} from "react-i18next";

interface Props {
  setNext: Dispatch<SetStateAction<any>>;
}
export default function NewTemplates({ setNext }: Props) {
  // @ts-expect-error
  let [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  const { t } = useTranslation();

  // Dropdown state
  const setCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setTemplatePatternList = useSetRecoilState(templatePatternList);
  const setTemplateTypeList = useSetRecoilState(templateTypeList);
  const setProductCatalogueList = useSetRecoilState(productCatalogueList);

  // Search Form fields
  // const formSearch = useForm<
  //   z.infer<typeof templateProductCatalogueDetailSearchSchema>
  // >({
  //   resolver: zodResolver(templateProductCatalogueDetailSearchSchema),
  //   defaultValues: {
  //     categoryOne: "",
  //     categoryTwo: "",
  //     productCatalogue: "",
  //   },
  // });

  // Form fields
  const form = useForm<z.infer<typeof templateSchema>>({
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
  });

  // Form submit function
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
      const newTemplate = await axios.post("template/", formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newTemplate.data.message);
      form.reset();
      setIsLoading(false);
      setSearchParams({ template: newTemplate.data.data.Id, tab: "cutting" });
      setNext("cutting");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
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
      {/* <div className="space-y-1">
        <TemplateProductCatalogueDetailSearchForm form={formSearch} />
      </div> */}
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
                t("Next")
              )}
          </Button>
        </div>
      </div>
    </div>
  );
}
