import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { feedbackData, feedbackId, submitTaskModal } from "@/store/Tasks";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import SubmitTaskForm from "./SubmitTaskForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/form_schemas/newTaskSchema";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Props {
  getTasks: any;
}
export default function SubmitTask({ getTasks }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useRecoilState(submitTaskModal);
  const feedbackID = useRecoilValue(feedbackId);
  const currentFeedback = useRecoilValue(feedbackData);

  // Handle File
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      Feedback: "",
    },
    values: currentFeedback,
  });

  const handleSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    try {
      if (file !== null) {
        formData.append("task", file);
      }
      formData.append("Feedback", data.Feedback);

      const newTask = await axios.put(`task/feedback/${feedbackID}`, formData, {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> {t("TaskFeedback")}</DialogTitle>
        </DialogHeader>
        <SubmitTaskForm
          form={form}
          onSubmit={handleSubmit}
          handleFileChange={handleFileChange}
        />
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="submit-task">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Please wait")}
              </>
            ) : (
              t("Submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
