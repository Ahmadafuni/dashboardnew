import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  templateProductCatalogueDetailSearchSchema,
  templateSchema,
} from "@/form_schemas/newTemplateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import TemplateForm from "./TemplateForm";
import TemplateProductCatelogueDetailSearchForm from "./TemplateProductCatelogueDetailSearchForm";
import { useSetRecoilState } from "recoil";
import { productCatalogueDetailsList } from "@/store/ProductCatalogueDetails";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";

export default function NewTemplates() {
  // Translation
  const { t } = useTranslation();
  // Navigation state
  const navigate = useNavigate();
  // Loding
  const [isLoading, setIsLoading] = useState(false);
  // File
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  // Dropdown state
  const setCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setPCDS = useSetRecoilState(productCatalogueDetailsList);

  // Search Form fields
  const formSearch = useForm<
    z.infer<typeof templateProductCatalogueDetailSearchSchema>
  >({
    resolver: zodResolver(templateProductCatalogueDetailSearchSchema),
    defaultValues: {
      categoryOne: "",
      categoryTwo: "",
    },
  });

  // Search submit function
  const onSubmitSearch = async (
    data: z.infer<typeof templateProductCatalogueDetailSearchSchema>
  ) => {
    setIsLoading(true);
    try {
      if (data.categoryOne.length <= 0 && data.categoryTwo.length <= 0) {
        toast.warning("Please select at least one category to search!");
        setIsLoading(false);
        return;
      }
      const pcds = await axios.post(
        "productcatalogtdetail/search-by-category",
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setPCDS(pcds.data.data);
      toast.success(pcds.data.message);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Form fields
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      productCatalogDetailId: "",
      description: "",
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
      formData.append("productCatalogDetailId", data.productCatalogDetailId);
      const newTemplate = await axios.post("template/", formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newTemplate.data.message);
      form.reset();
      setIsLoading(false);
      navigate("/dashboard/templates");
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
  });
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">New Template</h1>
        <Separator />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold w-full">
          Search Product Catalogue Details
        </h2>
        <TemplateProductCatelogueDetailSearchForm
          form={formSearch}
          onSubmit={onSubmitSearch}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="template-pcd-search">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
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
              t("Add")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
