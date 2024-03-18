import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { departmentSchema } from "@/form_schemas/newDepartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const categories = [
  { label: "CUTTING", value: "CUTTING" },
  { label: "TAILORING", value: "TAILORING" },
  { label: "PRINTING", value: "PRINTING" },
  { label: "QUALITYASSURANCE", value: "QUALITYASSURANCE" },
  { label: "ENGINEERING", value: "ENGINEERING" },
  { label: "FACTORYMANAGER", value: "FACTORYMANAGER" },
  { label: "WAREHOUSEMANAGER", value: "WAREHOUSEMANAGER" },
];
export default function UpdateDepartment() {
  // Param
  const { departmentID } = useParams();
  // Navigation state
  const navigate = useNavigate();
  // Department
  const [department, setDepartment] = useState({
    name: "",
    location: "",
    description: "",
    category: "",
  });
  // Get Department
  const getDepartment = async () => {
    try {
      const { data } = await axios.get(`department/${departmentID}`);
      setDepartment(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
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
    values: department,
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof departmentSchema>) => {
    setIsLoading(true);
    try {
      const updateDepartment = await axios.put(
        `department/${departmentID}`,
        data
      );
      toast.success(updateDepartment.data.message);
      setIsLoading(false);
      navigate("/dashboard/departments");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Update department</h1>
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
                  placeholder={"Cutting"}
                  label={"Name"}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"Sector-1"}
                  label={"Location"}
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
                  label="Category"
                  placeholder="Select a category"
                  items={categories}
                />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"Description..."}
                  label={"Description"}
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
              "Update"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}