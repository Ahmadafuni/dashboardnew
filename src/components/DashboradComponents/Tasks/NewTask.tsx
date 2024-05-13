import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";
import { taskSchema } from "@/form_schemas/newTaskSchema.ts";
import TaskForm from "./TaskForm";
import { newTaskModal } from "@/store/Tasks.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getAllDepartmentList } from "@/services/Departments.services";
import { departmentList } from "@/store/Department";

interface Props {
  getTasks: any;
}

export default function NewTask({ getTasks }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useRecoilState(newTaskModal);

  // Dropdown List
  const setDepartmentList = useSetRecoilState(departmentList);

  // Handle File
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      TaskName: "",
      DueDate: new Date(),
      AssignedToDepartmentId: "",
      Description: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    try {
      if (file !== null) {
        formData.append("task", file);
      }
      formData.append("TaskName", data.TaskName);
      // @ts-expect-error
      formData.append("DueDate", data.DueDate);
      formData.append("AssignedToDepartmentId", data.AssignedToDepartmentId);
      formData.append("Description", data.Description);

      const newTask = await axios.post("task/", formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newTask.data.message);
      getTasks();
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
  // Page On load
  useEffect(() => {
    getAllDepartmentList(setDepartmentList);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("NewTask")}</DialogTitle>
        </DialogHeader>
        <TaskForm
          form={form}
          onSubmit={handleSubmit}
          handleFileChange={handleFileChange}
        />
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("Cancel")}
          </Button>
          <Button type="submit" disabled={isLoading} form="task">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Please wait")}
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