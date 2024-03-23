import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { newTemplateTypeSchema } from "@/form_schemas/newTemplateTypeSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import TemplateTypeDialog from "@/components/DashboradComponents/Entities/TemplateType/TemplateTypeDialog.tsx";
import { newTemplateTypeModal } from "@/store/TemplateType.ts";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { z } from "zod";

type Props = {
  getTemplateTypes: any;
};

export default function NewTemplateType({ getTemplateTypes }: Props) {
  const [open, setOpen] = useRecoilState(newTemplateTypeModal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof newTemplateTypeSchema>>({
    resolver: zodResolver(newTemplateTypeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof newTemplateTypeSchema>) => {
    setIsLoading(true);
    try {
      const newTemplateType = await axios.post("templatetype", data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newTemplateType.data.message);
      getTemplateTypes();
      form.reset();
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
          <DialogTitle>{t("NewTemplateType")}</DialogTitle>
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
              t("Add")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
