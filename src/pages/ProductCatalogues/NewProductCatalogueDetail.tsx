import ProductCatalogueDetailForm from "@/components/pages/ProductCatalogue/ProductCatalogueDetailForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { productCatalogueDetailSchema } from "@/form_schemas/newProductCatalogueSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function NewProductCatalogueDetail() {
  // Translation
  const { t } = useTranslation();
  // Param
  const { catalogueId } = useParams();
  // Navigation state
  const navigate = useNavigate();
  // Loding
  const [isLoading, setIsLoading] = useState(false);
  // Form fields
  const form = useForm<z.infer<typeof productCatalogueDetailSchema>>({
    resolver: zodResolver(productCatalogueDetailSchema),
    defaultValues: {
      category1: "",
      category2: "",
      description: "",
      grammage: 0.0,
      standardWeight: 0.0,
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
      const newDepartment = await axios.post("productcatalogtdetail/", {
        ...data,
        productCatalog: catalogueId,
      });
      toast.success(newDepartment.data.message);
      form.reset();
      setIsLoading(false);
      navigate("/dashboard/departments");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Product Catalogue Detail</h1>
        <Separator />
      </div>
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
