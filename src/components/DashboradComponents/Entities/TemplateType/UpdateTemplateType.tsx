import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  templateType,
  templateTypeId,
  updateTemplateTypeModal,
} from "@/store/TemplateType.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { newTemplateTypeSchema } from "@/form_schemas/newTemplateTypeSchema.ts";
import TemplateTypeDialog from "@/components/DashboradComponents/Entities/TemplateType/TemplateTypeDialog.tsx";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

type Props = {
  getTemplateTypes: () => void;
};

export default function UpdateTemplateType({ getTemplateTypes }: Props) {
  const templateTypeID = useRecoilValue(templateTypeId);
  const [open, setOpen] = useRecoilState(updateTemplateTypeModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentTemplateType = useRecoilValue(templateType);
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(newTemplateTypeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    values: currentTemplateType,
  });

  const onSubmit = async (data: z.infer<typeof newTemplateTypeSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`templatetype/${templateTypeID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getTemplateTypes(); // Refresh template types after update
      setIsLoading(false);
      setOpen(false);
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
          <DialogTitle>{t("UpdateTemplateType")}</DialogTitle>
        </DialogHeader>
        <TemplateTypeDialog form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="template-type">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
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
