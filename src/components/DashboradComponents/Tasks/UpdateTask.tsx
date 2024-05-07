import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";
import TaskForm from "./TaskForm";
import { taskSchema } from "@/form_schemas/newTaskSchema.ts";
import { taskData, taskId, updateTaskModal } from "@/store/Tasks.ts";

type Props = {
  getTasks: any;
};

export default function UpdateTask({ getTasks }: Props) {
  const taskID = useRecoilValue(taskId);
  const [open, setOpen] = useRecoilState(updateTaskModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentTask = useRecoilValue(taskData);
  const { t } = useTranslation();

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
    values: currentTask,
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
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

      const updateTask = await axios.put(`task/${taskID}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(updateTask.data.message);
      getTasks();
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
          <DialogTitle>{t("Update Task")}</DialogTitle>
        </DialogHeader>
        <TaskForm
          form={form}
          onSubmit={onSubmit}
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
              t("Update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
