import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { newTemplatePatternSchema } from "@/form_schemas/newTemplatePatternSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import TemplatePatternDialog from "@/components/DashboradComponents/Entities/TemplatePattern/TemplatePatternDialog.tsx";
import { newTemplatePatternModal } from "@/store/TemplatePattern.ts";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import Cookies from "js-cookie";

type Props = {
  getTemplatePatterns: any;
};

export default function NewTemplatePattern({ getTemplatePatterns }: Props) {
  const [open, setOpen] = useRecoilState(newTemplatePatternModal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof newTemplatePatternSchema>>({
    resolver: zodResolver(newTemplatePatternSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof newTemplatePatternSchema>) => {
    setIsLoading(true);
    try {
      const newTemplatePattern = await axios.post("templatepattern", data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newTemplatePattern.data.message);
      getTemplatePatterns();
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
          <DialogTitle>{t("NewTemplatePattern")}</DialogTitle>
        </DialogHeader>
        <TemplatePatternDialog form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="template-pattern">
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
