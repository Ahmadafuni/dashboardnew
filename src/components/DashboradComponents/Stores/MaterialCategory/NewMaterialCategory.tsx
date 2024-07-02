import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { newMaterialCategoryModal } from "@/store/MaterialCategory.ts";
import { materialCategorySchema } from "@/form_schemas/newMaterialCategorySchema.ts";
import MaterialCategoryForm from "@/components/DashboradComponents/Stores/MaterialCategory/MaterialCategoryForm.tsx";

type Props = {
  getMaterialCategories: any;
};

export default function NewMaterialCategory({ getMaterialCategories }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useRecoilState(newMaterialCategoryModal);

  // Form fields
  const form = useForm<z.infer<typeof materialCategorySchema>>({
    resolver: zodResolver(materialCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof materialCategorySchema>) => {
    setIsLoading(true);
    try {
      const newMaterialCategory = await axios.post("materialcategory/", data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newMaterialCategory.data.message);
      getMaterialCategories();
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
          <DialogTitle>{t("New Material Category")}</DialogTitle>
        </DialogHeader>
        <MaterialCategoryForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button type="submit" disabled={isLoading} form="materialCategory">
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
