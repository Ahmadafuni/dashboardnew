import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import UpdateTemplateForm from "./UpdateTemplateForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateUpdateSchema } from "@/form_schemas/newTemplateSchema";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { getTemplateById } from "@/services/Templates.services";
export default function UpdateTemplate() {
  const { templateId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  // Current Template
  const [currentTemplate, setCurrentTemplate] = useState({});
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
      formData.append("name", data.name);
      formData.append("description", data.description);
      console.log(formData.get("name"));

      const response = await axios.put(`template/${templateId}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  // Page on load
  useEffect(() => {
    getTemplateById(setCurrentTemplate, templateId);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Update Template</h1>
        <Separator />
      </div>
      <div className="space-y-1">
        <UpdateTemplateForm
          form={form}
          onSubmit={onSubmit}
          handleFileChange={handleFileChange}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="template-update">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
