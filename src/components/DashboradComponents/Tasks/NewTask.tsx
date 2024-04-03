import  { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { taskSchema } from "@/form_schemas/newTaskSchema.ts";
import TaskForm from "./TaskForm";
import {newTaskModal} from "@/store/Tasks.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import axios, {AxiosError} from "axios";
import Cookies from "js-cookie";
import {toast} from "sonner";

interface Props {
    getTasks: any;
}

export default  function  NewTask ({ getTasks }: Props)  {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useRecoilState(newTaskModal);

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            TaskName: "",
            ImplementationDate: new Date(),
            Status: "PENDING",
            AssignedToDepartmentId: 0,
            AssignedToWarehouseId: 0,
            Description: ""
        }
    });

    const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
        setIsLoading(true);
        try {
            const newTask = await axios.post("task/", data, {
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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("NewTask")}</DialogTitle>
                </DialogHeader>
                <TaskForm form={form} onSubmit={handleSubmit} />
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
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

