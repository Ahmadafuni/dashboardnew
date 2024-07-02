import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { parentMaterialSchema } from "@/form_schemas/newMaterialSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import MaterialForm from "@/components/DashboradComponents/Stores/Materials/MaterialForm.tsx";
import Cookies from "js-cookie";
import NewMaterialCategory from "@/components/DashboradComponents/Stores/MaterialCategory/NewMaterialCategory.tsx";
import { getAllMaterialCategoriesList } from "@/services/MaterialCategory.services.ts";
import { useSetRecoilState } from "recoil";
import { materialCategoryList } from "@/store/MaterialCategory.ts";
import BackButton from "@/components/common/BackButton";

export default function NewMaterial() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const setMaterialCategoryList = useSetRecoilState(materialCategoryList);

  // Form fields
  const form = useForm<z.infer<typeof parentMaterialSchema>>({
    resolver: zodResolver(parentMaterialSchema),
    defaultValues: {
      name: "",
      unitOfMeasure: "",
      category: "",
      description: "",
      usageLocation: "",
      alternativeMaterials: "",
      minimumLimit: "",
      isRelevantToProduction: false,
      hasChildren: false,
    },
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof parentMaterialSchema>) => {
    setIsLoading(true);
    try {
      const newMaterial = await axios.post("material/parent", data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newMaterial.data.message);
      form.reset();
      setIsLoading(false);
      navigate("/dashboard/materials");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllMaterialCategoriesList(setMaterialCategoryList);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewMaterialCategory
        getMaterialCategories={() =>
          getAllMaterialCategoriesList(setMaterialCategoryList)
        }
      />
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold w-full">{t("New Material")}</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <MaterialForm form={form} onSubmit={onSubmit} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="material">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Please wait")}
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
