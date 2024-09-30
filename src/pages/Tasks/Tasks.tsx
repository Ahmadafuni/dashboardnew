import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import DataTable from "@/components/common/DataTable.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, Download, Pen, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import {
  newTaskModal,
  updateTaskModal,
  taskId,
  taskData,
  feedbackData,
  checkSubmittedTaskModal,
} from "@/store/Tasks.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import {
  deleteTask,
  getAllTasks,
  getFeedbackById,
  getTaskById,
} from "@/services/Tasks.services.ts";
import { TaskType } from "@/types/Tasks/Tasks.types.ts";
import NewTask from "@/components/DashboradComponents/Tasks/NewTask.tsx";
import UpdateTask from "@/components/DashboradComponents/Tasks/UpdateTask.tsx";
import { downLoadFile } from "@/services/Commons.services";
import { Badge } from "@/components/ui/badge";
import CheckSubmittedTask from "@/components/DashboradComponents/Tasks/CheckSubmittedTask";
import LoadingDialog from "@/components/ui/LoadingDialog";

export default function Tasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const setNewTaskModal = useSetRecoilState(newTaskModal);
  const setUpdateTaskModal = useSetRecoilState(updateTaskModal);
  const setCheckSubmittedTaskModal = useSetRecoilState(checkSubmittedTaskModal);
  // Task
  const setTaskId = useSetRecoilState(taskId);
  const setCurrentTask = useSetRecoilState(taskData);
  // Feedback
  const setCurrentFeedback = useSetRecoilState(feedbackData);
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  const taskColumns: ColumnDef<TaskType>[] = [
    { accessorKey: "TaskName", header: t("TaskName") },
    {
      header: t("DueDate"),
      cell: ({ row }) => {
        return <p>{new Date(row.original.DueAt).toLocaleDateString()}</p>;
      },
    },
    {
      header: t("Department"),
      cell: ({ row }) => {
        return <p>{row.original.AssignedToDepartment.Name}</p>;
      },
    },
    {
      header: t("Status"),
      cell: ({ row }) => {
        return (
          <Badge
            variant={
              row.original.Status === "PENDING"
                ? "destructive"
                : row.original.Status === "ONGOING"
                ? "secondary"
                : "default"
            }
          >
            {row.original.Status}
          </Badge>
        );
      },
    },
    { accessorKey: "Description", header: t("Description") },
    {
      header: t("TaskFile")  ,
      cell: ({ row }) => {
        return (
          <Button
            type="button"
            disabled={row.original.AssignedFile.length <= 0 ? true : false}
            onClick={() =>
              downLoadFile(
                "https://dashboardbackendnew.onrender.com" +
                  row.original.AssignedFile
              )
            }
          >
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        );
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              disabled={!row.original.Feedback}
              onClick={() => {
                getFeedbackById(setCurrentFeedback, row.original.Id);
                setCheckSubmittedTaskModal(true);
              }}
            >
              <ClipboardCheck className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setTaskId(row.original.Id);
                getTaskById(setCurrentTask, row.original.Id);
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
    getAllTasks(setTasks , pages , sizes , setTotalPages , setIsLoading);
  }, [pages , sizes]);

  return (
    <div className="w-full space-y-2">
       {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />}
      <NewTask getTasks={() => getAllTasks(setTasks)} />
      <UpdateTask getTasks={() => getAllTasks(setTasks)} />
      <CheckSubmittedTask />
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
          <DataTable columns={taskColumns} data={tasks} tableName={"Tasks"} 
            page={pages}
            setPage={setPages}
            size={sizes}
            setSize={setSizes}
            totalPages={totalPages} 
          />
        </div>
      </div>
    </div>
  );
}
