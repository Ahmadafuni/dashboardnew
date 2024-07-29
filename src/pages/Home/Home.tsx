import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import { useTranslation } from "react-i18next";
import CollectionPieChart from "@/components/DashboradComponents/Home/CollectionPieChart";
import ModelBarChart from "@/components/DashboradComponents/Home/ModelBarChart";
import OrderBarChart from "@/components/DashboradComponents/Home/OrderBarChart";
import TaskDoughnutChart from "@/components/DashboradComponents/Home/TaskDoughnutChart";
import SubmitTask from "@/components/DashboradComponents/Tasks/SubmitTask";
import DataTable from "@/components/common/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { downLoadFile } from "@/services/Commons.services";
import { getCurrentNotes } from "@/services/Notes.services";
import {
  getCurrentTasks,
  getFeedbackById,
  startTask,
} from "@/services/Tasks.services";
import { feedbackData, feedbackId, submitTaskModal } from "@/store/Tasks";
import { NoteType } from "@/types/Notes/Notes.types";
import { TaskType } from "@/types/Tasks/Tasks.types";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Send } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const setFeedbackId = useSetRecoilState(feedbackId);
  const setCurrentFeedback = useSetRecoilState(feedbackData);
  const setSubmitTaskModal = useSetRecoilState(submitTaskModal);
  const user = useRecoilValue(userInfo); // Get user info from global state

  const noteColumns: ColumnDef<NoteType>[] = [
    {
      accessorKey: "NoteType",
      header: t("NoteType"),
    },
    {
      header: t("AssignedBy"),
      cell: ({ row }) => {
        return <p>{row.original.CreatedDepartment.Name}</p>;
      },
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
  ];

  const taskColumns: ColumnDef<TaskType>[] = [
    { accessorKey: "TaskName", header: t("TaskName") },
    {
      header: t("DueDate"),
      cell: ({ row }) => {
        return <p>{new Date(row.original.DueAt).toLocaleDateString()}</p>;
      },
    },
    {
      header: t("CreatedByDepartment"),
      cell: ({ row }) => {
        return <p>{row.original.CreatedByDepartment.Name}</p>;
      },
    },
    {
      header: t("Status"),
      cell: ({ row }) => {
        return (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={
                      row.original.Status === "PENDING"
                          ? "pointer-events-auto"
                          : "pointer-events-none"
                    }
                >
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
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("ActionConfirmation")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("AreYouSure")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                      onClick={() => {
                        startTask(setTasks, row.original.Id);
                      }}
                  >
                    {t("Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        );
      },
    },
    { accessorKey: "Description", header: t("Description") },
    {
      header: t("TaskFile"),
      cell: ({ row }) => {
        return (
            <Button
                type="button"
                disabled={row.original.AssignedFile.length <= 0}
                onClick={() =>
                    downLoadFile(
                        "https://dashboardbackendnew.onrender.com" +
                        row.original.AssignedFile
                    )
                }
            >
              <Download className="w-4 h-4 mr-2" /> {t("Download")}
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
                  onClick={() => {
                    setFeedbackId(row.original.Id);
                    getFeedbackById(setCurrentFeedback, row.original.Id);
                    setSubmitTaskModal(true);
                  }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
        );
      },
    },
  ];

  useEffect(() => {
    getCurrentNotes(setNotes);
    getCurrentTasks(setTasks);
  }, []);

  return (
      <div className="w-full p-4 space-y-6">
        <SubmitTask getTasks={() => getCurrentTasks(setTasks)} />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t("Home")}</h1>
          <Separator />
        </div>
        { (user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING") && (
            <div className="grid grid-cols-2 gap-6">
              <ModelBarChart />
              <OrderBarChart />
              <CollectionPieChart />
              <TaskDoughnutChart />
            </div>
        )}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("Notes")}</h2>
          <div className="overflow-x-auto rounded-md border">
            <DataTable columns={noteColumns} data={notes} />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("Tasks")}</h2>
          <div className="overflow-x-auto rounded-md border">
            <DataTable columns={taskColumns} data={tasks} />
          </div>
        </div>
      </div>
  );
}
