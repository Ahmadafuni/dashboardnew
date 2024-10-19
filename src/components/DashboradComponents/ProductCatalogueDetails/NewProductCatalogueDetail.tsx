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
import { useParams } from "react-router-dom";
import { getProductCatalogueById } from "@/services/ProductCatalogues.services";
import BackButton from "@/components/common/BackButton";

export default function NewProductCatalogueDetail() {
  // Translation
  const { t } = useTranslation();
  // Param
  const { catalogueId } = useParams();
  // Loding
  const [isLoading, setIsLoading] = useState(false);

  // Product Catalogue
  const [pCatalogue, setPCatalogue] = useState({});
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
  });
  // Form submit function
  const onSubmit = async (
    data: z.infer<typeof productCatalogueDetailSchema>
  ) => {
    setIsLoading(true);
    try {
      const newDetail = await axios.post(
        "productcatalogtdetail/",
        {
          ...data,
          grammage: parseFloat(data.grammage),
          standardWeight: parseFloat(data.standardWeight),
          productCatalog: catalogueId,
        },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newDetail.data.message);
      form.reset();
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
    getProductCatalogueById(setPCatalogue, catalogueId);
    getAllProductCategoryOneList(setCategoryOneList);
    getAllProductCategoryTwoList(setCategoryTwoList);
    getAllTemplatePatternsList(setTemplatePatternList);
    getAllTemplateTypesList(setTemplateTypeList);
    getAllTextilesList(setTextilesList);
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
      <NewTextiles getTextiles={() => getAllTextilesList(setTextilesList)} />
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold">
          {/* @ts-expect-error */}
            {t("NewProductCatalogueDetailsfor")} {pCatalogue?.name}
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
              t("Add")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
