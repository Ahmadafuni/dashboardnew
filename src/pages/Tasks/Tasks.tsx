import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import DataTable from "@/components/common/DataTable.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { newTaskModal, updateTaskModal, taskId } from "@/store/Tasks.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import {
    deleteTask,
    getAllTasks,
    getTaskById
} from "@/services/Tasks.services.ts";
import {TaskType} from "@/types/Tasks/Tasks.types.ts";
import NewTask from "@/components/DashboradComponents/Tasks/NewTask.tsx";
import UpdateTask from "@/components/DashboradComponents/Tasks/UpdateTask.tsx";

export default function Tasks() {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const setNewTaskModal = useSetRecoilState(newTaskModal);
    const setUpdateTaskModal = useSetRecoilState(updateTaskModal);
    const setTaskId = useSetRecoilState(taskId);

    const taskColumns: ColumnDef<TaskType>[] = [
        { accessorKey: "TaskName", header: t("TaskName"),},
        { accessorKey: "ImplementationDate", header: t("ImplementationDate"),},
        { accessorKey: "Status", header: t("Status"),},
        { accessorKey: "AssignedToDepartmentId", header: t("AssignedToDepartmentId"),},
        { accessorKey: "AssignedToWarehouseId", header: t("AssignedToWarehouseId"),},
        { accessorKey: "Description", header: t("Description"),},
        { header: t("Action"),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            onClick={() => {
                                setTaskId(row.original.Id);
                                getTaskById(setTasks, row.original.Id);
                                setUpdateTaskModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteTask(setTasks, row.original.Id)}
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllTasks(setTasks);
    }, []);

    return (
        <div className="w-full space-y-2">
            <NewTask getTasks={getAllTasks} />
            <UpdateTask getTasks={getAllTasks} />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("Tasks")}</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewTaskModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("AddTask")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={taskColumns} data={tasks} />
                </div>
            </div>
        </div>
    );
}
