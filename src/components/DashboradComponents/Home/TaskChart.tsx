import { useEffect, useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios'; // Axios for API calls
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { TaskType } from "@/types/Tasks/Tasks.types.ts";
import {useTranslation} from "react-i18next";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function TaskPolarAreaChart() {
    const { t } = useTranslation();

    const [tasks, setTasks] = useState<TaskType[]>([]); // To store fetched tasks
    const [timePeriod, setTimePeriod] = useState<string>('weekly'); // Default time filter
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        ongoing: 0,
        pending: 0,
        overdue: 0,
    });

    // Fetch tasks from backend when timePeriod changes
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/chart/taskchart?timePeriod=${timePeriod}`);
                setTasks(response.data.data); // Set fetched tasks
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [timePeriod]);

    // Recalculate task statistics when tasks change
    useEffect(() => {
        const currentDate = new Date();
        let completed = 0;
        let ongoing = 0;
        let pending = 0;
        let overdue = 0;

        tasks.forEach(task => {
            const dueDate = new Date(task.DueAt);

            // Categorize tasks by status
            if (task.Status === 'COMPLETED') {
                completed++;
            } else if (task.Status === 'ONGOING') {
                ongoing++;
            } else if (task.Status === 'PENDING') {
                pending++;
            }

            // Check for overdue tasks (pending or ongoing but due date passed)
            if ((task.Status === 'PENDING' || task.Status === 'ONGOING') && dueDate < currentDate) {
                overdue++;
            }
        });

        setTaskStats({ completed, ongoing, pending, overdue });
    }, [tasks]);

    // Data for the Polar Area chart
    const data = {
        labels: ['Completed', 'Ongoing', 'Pending', 'Overdue'],
        datasets: [
            {
                label: 'Task Status',
                data: [taskStats.completed, taskStats.ongoing, taskStats.pending, taskStats.overdue],
                backgroundColor: ['#42A5F5', '#4CAF50', '#FFB74D', '#E53935'],
                borderColor: ['#42A5F5', '#4CAF50', '#FFB74D', '#E53935'],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="w-full space-y-4">
            <div className="w-full md:w-1/3 text-right mb-4">
                <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value)}>
                    <SelectTrigger
                        className="w-[200px] bg-white border-gray-400 text-black shadow-md hover:bg-gray-100">
                        <SelectValue placeholder="Select Time Period"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="daily">{t("Daily")}</SelectItem>
                            <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                            <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                            <SelectItem value="yearly">{t("Yearly")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '500px'}}>
                    <PolarArea data={data}/>
                </div>
            </div>

        </div>
    );
}
