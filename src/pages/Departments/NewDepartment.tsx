import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
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
import {useTranslation} from 'react-i18next';
export default function NewDepartment() {

  const {t} = useTranslation();

  const categories = [
    { label:  t("CUTTING"), value: "CUTTING" },
    { label: t("TAILORING"), value: "TAILORING" },
    { label: t("PRINTING"), value: "PRINTING" },
    { label: t("QUALITYASSURANCE"), value: "QUALITYASSURANCE" },
    { label: t("ENGINEERING"), value: "ENGINEERING" },
    { label: t("FACTORYMANAGER"), value: "FACTORYMANAGER" },
    { label: t("WAREHOUSEMANAGER"), value: "WAREHOUSEMANAGER" },
  ];
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2"
            id="new-department"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={""}
                  label={t("Name")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={""}
                  label={t("Location")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <SelectFieldForForm
                  field={field}
                  label={t("Category")}
                  placeholder=""
                  items={categories}
                />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={""}
                  label={t("Description")}
                  field={field}
                />
              )}
            />
          </form>
        </Form>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="new-department">
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
