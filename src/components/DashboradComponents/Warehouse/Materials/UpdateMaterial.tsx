import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { parentMaterialSchema } from "@/form_schemas/newMaterialSchema.ts";
import { getMaterialById } from "@/services/Materials.services.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import MaterialForm from "@/components/DashboradComponents/Warehouse/Materials/MaterialForm.tsx";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";
import { getAllMaterialCategoriesList } from "@/services/MaterialCategory.services";
import { useSetRecoilState } from "recoil";
import { materialCategoryList } from "@/store/MaterialCategory";

export default function UpdateMaterial() {
  const { materialID } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<any>({});
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
    values: material,
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof parentMaterialSchema>) => {
    setIsLoading(true);
    try {
      const updateMaterial = await axios.put(
        `material/parent/${materialID}`,
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(updateMaterial.data.message);
      setIsLoading(false);
      navigate("/dashboard/materials");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  // Load material data on component mount
  useEffect(() => {
    getAllMaterialCategoriesList(setMaterialCategoryList);
    getMaterialById(setMaterial, materialID);
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold w-full">Update Material</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <MaterialForm form={form} onSubmit={onSubmit} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="material">
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
