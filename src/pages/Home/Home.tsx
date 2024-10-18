import {useEffect, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {userInfo} from "@/store/authentication.ts";
import {useTranslation} from "react-i18next";
import CollectionPieChart from "@/components/DashboradComponents/Home/CollectionPieChart";
import ModelBarChart from "@/components/DashboradComponents/Home/ModelBarChart";
import OrderBarChart from "@/components/DashboradComponents/Home/OrderBarChart";
import TaskDoughnutChart from "@/components/DashboradComponents/Home/TaskDoughnutChart";
import SubmitTask from "@/components/DashboradComponents/Tasks/SubmitTask";
import DataTable from "@/components/common/DataTable";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {downLoadFile} from "@/services/Commons.services";
import {getCurrentNotes} from "@/services/Notes.services";
import {
    getCurrentTasks,
    getFeedbackById,
    startTask,
} from "@/services/Tasks.services";
import {feedbackData, feedbackId, submitTaskModal} from "@/store/Tasks";
import {NoteType} from "@/types/Notes/Notes.types";
import {TaskType} from "@/types/Tasks/Tasks.types";
import {ColumnDef} from "@tanstack/react-table";
import {Download, Send} from "lucide-react";
import {BASE_URL} from "@/config/index.ts";
import axios from "axios";
import LoadingDialog from "@/components/ui/LoadingDialog.tsx";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import ConfirmationDialog from "@/components/common/ConfirmationDialog.tsx";

export default function Home() {
    const {t} = useTranslation();
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const setFeedbackId = useSetRecoilState(feedbackId);
    const setCurrentFeedback = useSetRecoilState(feedbackData);
    const setSubmitTaskModal = useSetRecoilState(submitTaskModal);
    const user = useRecoilValue(userInfo);

    const isDueDatePassed = (dueDate: Date) => {
        const currentDate = new Date();
        return new Date(dueDate) < currentDate;
    };

    const noteColumns: ColumnDef<NoteType>[] = [
        {
            accessorKey: "NoteType",
            header: t("NoteType"),
        },
        {
            header: t("AssignedBy"),
            cell: ({row}) => {
                return <p>{row.original.CreatedDepartment.Name}</p>;
            },
        },
        {
            accessorKey: "Description",
            header: t("Description"),
        },
    ];

    const taskColumns: ColumnDef<TaskType>[] = [
        {accessorKey: "TaskName", header: t("TaskName")},
        {
            header: t("DueDate"),
            cell: ({row}) => {
                const dueDatePassed = isDueDatePassed(row.original.DueAt);
                const flashStyle = {
                    animation: dueDatePassed ? "flash 1s infinite" : "none", // Apply flashing only if the due date has passed
                    backgroundColor: dueDatePassed ? "rgba(255, 0, 0, 0.2)" : "transparent", // Light red if due date passed, otherwise transparent
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
                            <p>{row.original.Description}</p>
                        </div>
                        <p>{new Date(row.original.DueAt).toLocaleDateString()}</p>
                    </div>
                );
            },
        },
        {
            header: t("CreatedByDepartment"),
            cell: ({row}) => {
                return <p>{row.original.CreatedByDepartment.Name}</p>;
            },
        },
        {
            header: t("Status"),
            cell: ({row}) => {
                const task = row.original;
                return (
                    <ConfirmationDialog
                        triggerButton={
                            <Button variant="ghost" disabled={(task.Status !== "PENDING")}>
                                <Badge
                                    className={
                                        task.Status === "PENDING"
                                            ? "bg-orange-500 text-white"
                                            : task.Status === "ONGOING"
                                                ? "bg-green-500 text-white"
                                                : task.Status === "COMPLETED"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300 text-black"
                                    }
                                >
                                    {t(task.Status)}
                                </Badge>
                            </Button>
                        }
                        onConfirm={() => startTask(setTasks, row.original.Id)}
                    />
                );
            },
        },
        {accessorKey: "Description", header: t("Description")},
        {
            header: t("TaskFile"),
            cell: ({row}) => {
                return (
                    <Button
                        type="button"
                        disabled={row.original.AssignedFile.length <= 0}
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
                        <ButtonTooltipStructure description={t("SendFeedBack")}>
                            <Button
                                onClick={() => {
                                    setFeedbackId(row.original.Id);
                                    getFeedbackById(setCurrentFeedback, row.original.Id);
                                    setSubmitTaskModal(true);
                                }}
                            >
                                <Send className="h-4 w-4"/>
                            </Button>
                        </ButtonTooltipStructure>
                    </div>
                );
            },
        },
    ];

    const [modStat, setModelsStat] = useState([]);
    const [ordStat, setOrdersStat] = useState([]);
    const [collecStat, setCollectionsStat] = useState({});
    const [tasksStat, setTasksStat] = useState({});

    const getStats = async (target: string, type: string) => {
        try {
            const response = await axios.get(`model/${target}-stats`, {
                params: {
                    type: type,
                },
            });
            const data = response.data;

            switch (target) {
                case "model":
                    setModelsStat(data);
                    break;
                case "orders":
                    setOrdersStat(data);
                    break;
                case "collections":
                    setCollectionsStat(data);
                    break;
                case "tasks":
                    setTasksStat(data);
                    break;
                default:
                    console.log("wrong target!");
                    break;
            }
        } catch (error) {
            console.log("Errors are: ", error);
        }
    };

    const [typeModelStat, setTypeModelStat] = useState("weekly");
    const [typeOrderStat, setTypeOrderStat] = useState("weekly");
    const [typeCollectionStat, setTypeCollectionStat] = useState("weekly");
    const [typeTaskStat, setTypeTaskStat] = useState("weekly");
    const labels = {
        monthly: [
            t("Jan"),
            t("Feb"),
            t("Mar"),
            t("Apr"),
            t("May"),
            t("Jun"),
            t("Jul"),
            t("Aug"),
            t("Sep"),
            t("Oct"),
            t("Nov"),
            t("Dec"),
        ],
        weekly: [t("Week1"), t("Week2"), t("Week3"), t("Week4")],
        daily: [
            t("Sat"),
            t("Sun"),
            t("Mon"),
            t("Tue"),
            t("Wed"),
            t("Thu"),
            t("Fri"),
        ],
    };

    const [pagesTask, setPagesTask] = useState(1);
    const [sizesTask, setSizesTask] = useState(10);
    const [totalPagesTask, setTotalPagesTask] = useState(1);
    const [isLoadingTask, setIsLoadingTask] = useState(false);

    const [pagesNotes, setPagesNotes] = useState(1);
    const [sizesNotes, setSizesNotes] = useState(10);
    const [totalPagesNotes, setTotalPagesNotes] = useState(1);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);


    useEffect(() => {
        getCurrentTasks(setTasks, pagesTask, sizesTask, setTotalPagesTask, setIsLoadingTask);
    }, [pagesTask, sizesTask]);

    useEffect(() => {
        getCurrentNotes(setNotes, pagesNotes, sizesNotes, setTotalPagesNotes, setIsLoadingNotes);
    }, [pagesNotes, sizesNotes]);

    useEffect(() => {
        if ((user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING")) {
            getStats("model", "weekly");
            getStats("orders", "weekly");
            getStats("collections", "weekly");
            getStats("tasks", "weekly");
        }
    }, []);

    useEffect(() => {
        if ((user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING")) {
            getStats("model", typeModelStat);

        }
    }, [typeModelStat]);

    useEffect(() => {
        if ((user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING")) {
            getStats("orders", typeOrderStat);
        }
    }, [typeOrderStat]);

    useEffect(() => {
        if ((user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING")) {
            getStats("collections", typeCollectionStat);

        }
    }, [typeCollectionStat]);

    useEffect(() => {
        if ((user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING")) {
            getStats("tasks", typeTaskStat);

        }
    }, [typeTaskStat]);

    return (
        <div className="w-full p-4 space-y-6">
            <SubmitTask getTasks={() => getCurrentTasks(setTasks)}/>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{t("Home")}</h1>
                <Separator/>
            </div>
            {(user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING") && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-center">{t("ModelStatistics")}</h3>
                        <ModelBarChart
                            data={modStat}
                            labels={labels}
                            type={typeModelStat}
                            setType={setTypeModelStat}
                        />
                    </div>

                    <div>
                        <h3 className="text-center">{t("OrderStatistics")}</h3>
                        <OrderBarChart
                            data={ordStat}
                            labels={labels}
                            type={typeOrderStat}
                            setType={setTypeOrderStat}
                        />
                    </div>

                    <div>
                        <h3 className="text-center">{t("CollectionStatistics")}</h3>
                        <CollectionPieChart
                            statsData={collecStat}
                            setType={setTypeCollectionStat}
                        />
                    </div>

                    <div>
                        <h3 className="text-center">{t("TaskStatistics")}</h3>
                        <TaskDoughnutChart
                            statsData={tasksStat}
                            setType={setTypeTaskStat}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t("Notes")}</h2>
                <div className="overflow-x-auto rounded-md border">
                    {isLoadingNotes &&
                        <LoadingDialog
                            isOpen={isLoadingNotes}
                            message="Loading..."
                            subMessage="Please wait, your request is being processed now."
                        />}

                    <DataTable columns={noteColumns} data={notes} tableName="Notes"
                               page={pagesNotes}
                               setPage={setPagesNotes}
                               size={sizesNotes}
                               setSize={setSizesNotes}
                               totalPages={totalPagesNotes}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t("Tasks")}</h2>
                <div className="overflow-x-auto rounded-md border">
                    {isLoadingTask &&
                        <LoadingDialog
                            isOpen={isLoadingTask}
                            message="Loading..."
                            subMessage="Please wait, your request is being processed now."
                        />}
                    <DataTable columns={taskColumns} data={tasks} tableName={"Tasks"}
                               page={pagesTask}
                               setPage={setPagesTask}
                               size={sizesTask}
                               setSize={setSizesTask}
                               totalPages={totalPagesTask}
                    />
                </div>
            </div>
        </div>
    );
}
