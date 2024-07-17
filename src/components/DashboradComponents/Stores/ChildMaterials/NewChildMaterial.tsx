import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import ChildMaterialForm from "./ChildMaterialForm";
import { useRecoilState, useRecoilValue } from "recoil";
import { newChildMaterialModal } from "@/store/ChildMaterial";
import { childMaterialSchema } from "@/form_schemas/newMaterialSchema";
import { materialId } from "@/store/Material";

type Props = {
  getChildMaterials: any;
};

export default function NewChildMaterial({ getChildMaterials }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useRecoilState(newChildMaterialModal);
  const currentMaterialId = useRecoilValue(materialId);

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

  const onSubmit = async (data: z.infer<typeof childMaterialSchema>) => {
    setIsLoading(true);
    try {
      const newMaterial = await axios.post(
          `material/child/${currentMaterialId}`,
          data,
          {
            headers: {
              Authorization: `bearer ${Cookies.get("access_token")}`,
            },
          }
      );
      toast.success(newMaterial.data.message);
      getChildMaterials();
      form.reset();
      setIsLoading(false);
      setOpen(false); // Close dialog after successful submission
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("New Child Material")}</DialogTitle>
          </DialogHeader>
          <ChildMaterialForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
