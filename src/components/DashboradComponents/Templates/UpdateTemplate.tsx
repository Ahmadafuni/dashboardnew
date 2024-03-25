import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { template, templateId, updateTemplateModal } from "@/store/Template";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import UpdateTemplateForm from "./UpdateTemplateForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateUpdateSchema } from "@/form_schemas/newTemplateSchema";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

type Props = {
  getTemplates: () => void;
};
export default function UpdateTemplate({ getTemplates }: Props) {
  const templateID = useRecoilValue(templateId);
  const [open, setOpen] = useRecoilState(updateTemplateModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentTemplate = useRecoilValue(template);
  const { t } = useTranslation();
  // File
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  const form = useForm({
    resolver: zodResolver(templateUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    values: currentTemplate,
  });
  const onSubmit = async (data: z.infer<typeof templateUpdateSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file !== null) {
        formData.append("template", file);
      }
      formData.append("description", data.description);
      formData.append("name", data.name);
      const response = await axios.put(`template/${templateID}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getTemplates();
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
          <DialogTitle>Update Template</DialogTitle>
        </DialogHeader>
        <UpdateTemplateForm
          form={form}
          onSubmit={onSubmit}
          handleFileChange={handleFileChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="color">
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
