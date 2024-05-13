import ProductCatalogueDetailForm from "@/components/DashboradComponents/ProductCatalogueDetails/ProductCatalogueDetailForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { productCatalogueDetailSchema } from "@/form_schemas/newProductCatalogueSchema.ts";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services.ts";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services.ts";
import { getAllTemplatePatternsList } from "@/services/TemplatePattern.services.ts";
import { getAllTemplateTypesList } from "@/services/TemplateType.services.ts";
import { getAllTextilesList } from "@/services/Textiles.services.ts";
import { productCategoryOneList } from "@/store/ProductCategoryOne.ts";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo.ts";
import { templatePatternList } from "@/store/TemplatePattern.ts";
import { templateTypeList } from "@/store/TemplateType.ts";
import { textileList } from "@/store/Textiles.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import NewProductCategoryOne from "@/components/DashboradComponents/Entities/ProductCategoryOne/NewProductCategoryOne.tsx";
import NewProductCategoryTwo from "@/components/DashboradComponents/Entities/ProductCategoryTwo/NewProductCategoryTwo.tsx";
import NewTemplatePattern from "@/components/DashboradComponents/Entities/TemplatePattern/NewTemplatePattern.tsx";
import NewTemplateType from "@/components/DashboradComponents/Entities/TemplateType/NewTemplateType.tsx";
import NewTextiles from "@/components/DashboradComponents/Entities/Textiles/NewTextiles.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { getProductCatalogueDetailById } from "@/services/ProductCatalogueDetails.services.ts";
import BackButton from "@/components/common/BackButton";

export default function UpdateProductCatalogueDetail() {
  // Translation
  const { t } = useTranslation();
  // Param
  const { detailId } = useParams();
  // Navigation state
  const navigate = useNavigate();
  // Loding
  const [isLoading, setIsLoading] = useState(false);
  // Detail State
  const [detail, setDetail] = useState({
    category1: "",
    category2: "",
    description: "",
    grammage: "",
    standardWeight: "",
    season: "",
    templatePattern: "",
    templateType: "",
    textile: "",
  });
  // Dropdown state
  const setCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setTemplatePatternList = useSetRecoilState(templatePatternList);
  const setTemplateTypeList = useSetRecoilState(templateTypeList);
  const setTextilesList = useSetRecoilState(textileList);
  // Form fields
  const form = useForm<z.infer<typeof productCatalogueDetailSchema>>({
    resolver: zodResolver(productCatalogueDetailSchema),
    defaultValues: {
      category1: "",
      category2: "",
      description: "",
      grammage: "",
      standardWeight: "",
      season: "",
      templatePattern: "",
      templateType: "",
      textile: "",
    },
    values: detail,
  });
  // Form submit function
  const onSubmit = async (
    data: z.infer<typeof productCatalogueDetailSchema>
  ) => {
    setIsLoading(true);
    try {
      const updateDetail = await axios.put(
        `productcatalogtdetail/${detailId}`,
        {
          ...data,
          grammage: parseFloat(data.grammage),
          standardWeight: parseFloat(data.standardWeight),
        },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(updateDetail.data.message);
      setIsLoading(false);
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    getProductCatalogueDetailById(setDetail, detailId);
    getAllProductCategoryOneList(setCategoryOneList);
    getAllProductCategoryTwoList(setCategoryTwoList);
    getAllTemplatePatternsList(setTemplatePatternList);
    getAllTemplateTypesList(setTemplateTypeList);
    getAllTextilesList(setTextilesList);
  });
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
      <NewTextiles getTextiles={() => getAllTextilesList(setTextilesList)} />
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold w-full">
          Update Product Catalogue Detail
        </h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <ProductCatalogueDetailForm form={form} onSubmit={onSubmit} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="catalogue-detail">
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
