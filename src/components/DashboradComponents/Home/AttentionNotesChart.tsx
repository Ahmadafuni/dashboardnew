import { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

// Register necessary ChartJS components for Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function AttentionNotesBarChart() {
    const { t } = useTranslation();
    const [timePeriod, setTimePeriod] = useState<string>("weekly");
    const [data, setData] = useState([]);

    // Fetch all "ATTENTION" notes from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/chart/notechart?timePeriod=${timePeriod}`);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching attention notes:", error);
            }
        };

        fetchData();
    }, [timePeriod]);

    // Count the number of ATTENTION notes per department
    const departmentCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach((note) => {
            // @ts-ignore
            const departmentName = note.AssignedToDepartment.Name;
            if (departmentName) {
                counts[departmentName] = (counts[departmentName] || 0) + 1;
            }
        });
        return counts;
    }, [data]);

    // Prepare data for the Bar chart
    const barData = {
        labels: Object.keys(departmentCounts), // Department names
        datasets: [
            {
                label: 'ATTENTION Notes',
                data: Object.values(departmentCounts), // Count of ATTENTION notes per department
                backgroundColor: Object.keys(departmentCounts).map(
                    (_, idx) => `rgba(${(idx * 50) % 255}, ${(idx * 80) % 255}, ${(idx * 100) % 255}, 0.7)`
                ), // Use attractive colors
                borderColor: "#fff",
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('Departments'),
                },
            },
            y: {
                title: {
                    display: true,
                    text: t('Number of ATTENTION Notes'),
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
            },
            title: {
                display: true,
                text: 'Departments with ATTENTION Notes',
                font: {
                    size: 18,
                    weight: 'bold',
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderColor: "#fff",
                borderWidth: 2,
                titleFont: { size: 16, weight: 'bold' },
            },
        },
    };

    return (
        <div className="w-full space-y-4">
            <div className="w-full md:w-1/3 text-right mb-4">
                <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value)}>
                    <SelectTrigger className="w-[200px] bg-white border-gray-400 text-black shadow-md hover:bg-gray-100">
                        <SelectValue placeholder="Select Time Period" />
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

            {/* Bar Chart for Attention Notes per Department */}
            <div className="w-full h-[400px] p-4 bg-gray-100 rounded-lg shadow-lg">
                {/* @ts-ignore */}
                <Bar data={barData} options={options} />
            </div>
        </div>
    );
}
