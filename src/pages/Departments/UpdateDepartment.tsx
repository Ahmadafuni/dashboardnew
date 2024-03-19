import DepartmentForm from "@/components/pages/Departments/DepartmentForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { departmentSchema } from "@/form_schemas/newDepartmentSchema";
import { getDepartmentById } from "@/services/Departments.services";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

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
  // Page on load
  useEffect(() => {
    getDepartmentById(setDepartment, departmentID);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Update department</h1>
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
              "Update"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
