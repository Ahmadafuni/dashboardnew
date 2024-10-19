import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import DataTable from "@/components/common/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {ClipboardCheck, Download, Pen, Plus} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useSetRecoilState} from "recoil";
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
import {TaskType} from "@/types/Tasks/Tasks.types.ts";
import NewTask from "@/components/DashboradComponents/Tasks/NewTask.tsx";
import UpdateTask from "@/components/DashboradComponents/Tasks/UpdateTask.tsx";
import {downLoadFile} from "@/services/Commons.services";
import {Badge} from "@/components/ui/badge";
import CheckSubmittedTask from "@/components/DashboradComponents/Tasks/CheckSubmittedTask";
import LoadingDialog from "@/components/ui/LoadingDialog";
import {BASE_URL} from "@/config";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import {format, intervalToDuration} from 'date-fns';
import {Clock} from 'lucide-react';
import TaskChart from "@/components/DashboradComponents/Home/TaskChart.tsx";

export default function Tasks() {
    const {t} = useTranslation();
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

    const isDueDatePassed = (dueDate: Date) => {
        const currentDate = new Date();
        return new Date(dueDate) < currentDate;
    };

    const taskColumns: ColumnDef<TaskType>[] = [
        {accessorKey: "TaskName", header: t("TaskName")},
        {
            header: t("DueDate"),
            cell: ({row}) => {
                const dueDatePassed = isDueDatePassed(row.original.DueAt);
                const taskCompleted = row.original.Status === "COMPLETED";
                const flashStyle = {
                    animation: dueDatePassed && !taskCompleted ? "flash 1s infinite" : "none", // Apply flashing only if the due date has passed and task is not completed
                    backgroundColor: dueDatePassed && !taskCompleted ? "rgba(255, 0, 0, 0.2)" : "transparent", // Light red if due date passed, otherwise transparent
                    padding: "10px", // Some padding to make the row look better
                    borderRadius: "5px", // Add slight rounding to the corners
                };

                // Define the keyframes animation inline
                const flashKeyframes = `
                    @keyframes flash {
                      0%, 100% { background-color: rgba(255, 0, 0, 0.2); } 
                      50% { background-color: rgba(255, 0, 0, 0.6); }
                    }
                  `;
                return (
                    <div className="flex items-center space-x-2">
                        <style>
                            {flashKeyframes}
                        </style>
                        <div style={flashStyle} className="flex items-center space-x-2">
                            <p>{new Date(row.original.DueAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                );
            },
        },

        {
            header: t("Department"),
            cell: ({row}) => {
                return <p>{row.original.AssignedToDepartment.Name}</p>;
            },
        },
        {
            header: t("Status"),
            cell: ({row}) => {
                return (
                    <Badge
                        className={
                            row.original.Status === "PENDING"
                                ? "bg-orange-500 text-white"
                                : row.original.Status === "ONGOING"
                                    ? "bg-green-500 text-white"
                                    : row.original.Status === "COMPLETED"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-black"
                        }
                    >
                        {row.original.Status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "Description",
            header: t("Description"),
            cell: ({ row }) => {
                const description = row.original.Description;
                const formattedDescription = description.replace(/\n/g, "<br />");

                return (
                    <div
                        dangerouslySetInnerHTML={{ __html: formattedDescription }}
                    />
                );
            },
        },
        {
            header: t("StartTime"),
            cell: ({row}) => {
                return <p>{row.original.StartTime
                    ? format(new Date(row.original.StartTime), "yyyy-MM-dd HH:mm:ss") : t("N/A")}</p>
            },
        },
        {
            header: t("Duration"),
            cell: ({row}) => {
                const {StartTime, EndTime} = row.original;
                if (StartTime && EndTime) {
                    const start = new Date(StartTime);
                    const end = new Date(EndTime);
                    const duration = intervalToDuration({start, end});
                    return (
                        <div className="flex items-center space-x-2">
                          <span>
                             {`${duration.hours || 0}h ${duration.minutes || 0}m ${duration.seconds || 0}s`}
                          </span>
                            <Clock className="text-blue-500 w-4 h-4"/>
                        </div>
                    );
                }
                return <p>{t("N/A")}</p>;
            },
        },

        {
            header: t("TaskFile"),
            cell: ({row}) => {
                return (
                    <Button
                        type="button"
                        disabled={row.original.AssignedFile.length <= 0 ? true : false}
                        onClick={() =>
                            downLoadFile(BASE_URL + row.original.AssignedFile)
                        }
                    >
                        <Download className="w-4 h-4 mr-2"/> {t("Download")}
                    </Button>
                );
            },
        },
        {
            header: t("Action"),
            cell: ({row}) => {
                return (
                    <div className="flex gap-1">
                        <ButtonTooltipStructure description={t("CheckTask")}>
                            <Button
                                disabled={!row.original.Feedback}
                                onClick={() => {
                                    getFeedbackById(setCurrentFeedback, row.original.Id);
                                    setCheckSubmittedTaskModal(true);
                                }}
                            >
                                <ClipboardCheck className="h-4 w-4"/>
                            </Button>
                        </ButtonTooltipStructure>
                        <Button
                            onClick={() => {
                                setTaskId(row.original.Id);
                                getTaskById(setCurrentTask, row.original.Id);
                                setUpdateTaskModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4"/>
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
        getAllTasks(setTasks, pages, sizes, setTotalPages, setIsLoading);
    }, [pages, sizes]);

    return (
        <div className="w-full space-y-2">
            {isLoading &&
                <LoadingDialog
                    isOpen={isLoading}
                    message="Loading..."
                    subMessage="Please wait, your request is being processed now."
                />}
            <NewTask getTasks={() => getAllTasks(setTasks)}/>
            <UpdateTask getTasks={() => getAllTasks(setTasks)}/>
            <CheckSubmittedTask/>
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("Tasks")}</h1>
                <Separator/>
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewTaskModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4"/>
                        {t("AddTask")}
                    </Button>
                </div>
                <div>
                    <TaskChart tasks={tasks}/>
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
