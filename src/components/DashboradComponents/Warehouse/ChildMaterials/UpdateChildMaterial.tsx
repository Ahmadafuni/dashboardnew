import { useState } from "react";
import ChildMaterialForm from "./ChildMaterialForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { childMaterialSchema } from "@/form_schemas/newMaterialSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  updateChildMaterialModal,
  childMaterialId,
  childMaterial,
} from "@/store/ChildMaterial";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  getChildMaterialByParentId: any;
};

export default function UpdateChildMaterial({ getChildMaterialByParentId }: Props) {
  const childID = useRecoilValue(childMaterialId);
  const currentChild = useRecoilValue(childMaterial);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useRecoilState(updateChildMaterialModal);

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
    values: currentChild,
  });

  const onSubmit = async (data: z.infer<typeof childMaterialSchema>) => {
    setIsLoading(true);
    try {
      const updatedMaterial = await axios.put(`material/child/${childID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(updatedMaterial.data.message);
      getChildMaterialByParentId();
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
            <DialogTitle>{t("UpdateChildMaterial")}</DialogTitle>
          </DialogHeader>
          <ChildMaterialForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button type="submit" disabled={isLoading} form="material-child">
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("PleaseWait")}
                  </>
              ) : (
                  t("Update")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
