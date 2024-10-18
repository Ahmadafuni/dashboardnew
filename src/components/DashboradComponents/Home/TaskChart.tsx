import { useEffect, useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { TaskType } from "@/types/Tasks/Tasks.types.ts"; // Assuming this type is defined in your project

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface TaskChartProps {
    tasks: TaskType[];
}

export default function TaskPolarAreaChart({ tasks }: TaskChartProps) {
    const [taskStats, setTaskStats] = useState({
        completed: 0,
        ongoing: 0,
        pending: 0,
        overdue: 0,
    });

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
        <div style={{ width: '600px', margin: '0 auto' }}>
            <PolarArea data={data}  />
        </div>
    );
}
