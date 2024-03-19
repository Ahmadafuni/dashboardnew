import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { departmentSchema } from "@/form_schemas/newDepartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import DepartmentForm from "@/components/pages/Departments/DepartmentForm";
export default function NewDepartment() {
  // Translation
  const { t } = useTranslation();
  // Navigation state
  const navigate = useNavigate();
  // Loding
  const [isLoading, setIsLoading] = useState(false);
  // Form fields
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      category: "",
    },
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof departmentSchema>) => {
    setIsLoading(true);
    try {
      const newDepartment = await axios.post("department/", data);
      toast.success(newDepartment.data.message);
      form.reset();
      setIsLoading(false);
      navigate("/dashboard/departments");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Newdepartment")}</h1>
        <Separator />
      </div>
      <div className="space-y-1">
        <DepartmentForm form={form} onSubmit={onSubmit} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="department">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
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
