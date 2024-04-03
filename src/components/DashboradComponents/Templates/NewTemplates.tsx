import { Button } from "@/components/ui/button";
import {
  templateProductCatalogueDetailSearchSchema,
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
import TemplateProductCatalogueDetailSearchForm from "./TemplateProductCatalogueDetailSearchForm.tsx";
import { useSetRecoilState } from "recoil";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";
import { productCatalogueList } from "@/store/ProductCatalogue.ts";
import { getAllProductCataloguesList } from "@/services/ProductCatalogues.services.ts";

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
  // Dropdown state
  const setCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setProductCatalogueList = useSetRecoilState(productCatalogueList);

  // Search Form fields
  const formSearch = useForm<
    z.infer<typeof templateProductCatalogueDetailSearchSchema>
  >({
    resolver: zodResolver(templateProductCatalogueDetailSearchSchema),
    defaultValues: {
      categoryOne: "",
      categoryTwo: "",
      productCatalogue: "",
    },
  });

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
    getAllProductCataloguesList(setProductCatalogueList);
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="space-y-1">
        <TemplateProductCatalogueDetailSearchForm form={formSearch} />
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
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
