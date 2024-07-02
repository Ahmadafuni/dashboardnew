import BackButton from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { childMaterialSchema } from "@/form_schemas/newMaterialSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import ChildMaterialForm from "./ChildMaterialForm";

export default function NewChildMaterial() {
  const { materialID } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const form = useForm<z.infer<typeof childMaterialSchema>>({
    resolver: zodResolver(childMaterialSchema),
    defaultValues: {
      Name: "",
      DyeNumber: "",
      Kashan: "",
      Halil: "",
      Phthalate: "",
      GramWeight: "",
      Description: "",
    },
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof childMaterialSchema>) => {
    setIsLoading(true);
    try {
      const newMaterial = await axios.post(
        `material/child/${materialID}`,
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newMaterial.data.message);
      form.reset();
      setIsLoading(false);
      navigate(-1);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold w-full">{t("New Material")}</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <ChildMaterialForm form={form} onSubmit={onSubmit} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="material-child">
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
