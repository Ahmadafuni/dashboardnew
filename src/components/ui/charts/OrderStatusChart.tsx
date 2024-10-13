import { Doughnut, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, PointElement, LinearScale } from "chart.js";
import { ChartData, ChartOptions } from "chart.js";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";

// Register necessary components in ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, Title, PointElement, LinearScale);

interface OrderStatus {
    id: number;
    orderName: string;
    runningStatus: string;
    createdAt: Date;
    deadlineDate: Date;
}

export default function OrderStatusChart() {
    const [orders, setOrders] = useState<OrderStatus[]>([]);
    const [timePeriod, setTimePeriod] = useState<string>("all");

    // Fetch order data from the backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/chart/orderchart");
                setOrders(response.data.data); // Assuming data is inside `data.data`
            } catch (error) {
                console.error("Error fetching orders data", error);
            }
        };
        fetchOrders();
    }, []);

    // Get filtered orders based on the selected time period

    const getFilteredOrders = () => {
        const now = new Date();
        const normalizedTimePeriod = timePeriod.toLowerCase(); // Normalize time period to lowercase

        const normalizeDate = (date: Date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const normalizedNow = normalizeDate(now);

        if (timePeriod === "daily") {


            return orders.filter(order => {
                const createdAt = normalizeDate(new Date(order.createdAt));
                return createdAt.getTime() === normalizedNow.getTime(); // Compare the date part only
            });

        }

        if (normalizedTimePeriod === "weekly") {
            const startOfWeek = new Date(normalizedNow);
            startOfWeek.setDate(normalizedNow.getDate() - normalizedNow.getDay());

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            return orders.filter(order => {
                const createdAt = normalizeDate(new Date(order.createdAt));
                return createdAt >= startOfWeek && createdAt <= endOfWeek;
            });
        }

        if (normalizedTimePeriod === "monthly") {
            return orders.filter(order => {
                const createdAt = new Date(order.createdAt);
                return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
            });
        }

        if (normalizedTimePeriod === "yearly") {
            return orders.filter(order => {
                const createdAt = new Date(order.createdAt);
                return createdAt.getFullYear() === now.getFullYear();
            });
        }

        return orders;
    };

    const filteredOrders = getFilteredOrders();


    // Calculate days past deadline or days remaining
    const now = new Date();
    const ordersWithDaysPassed = filteredOrders.map(order => {
        const deadline = new Date(order.deadlineDate);
        const timeDiff = deadline.getTime() - now.getTime();
        const daysPassed = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days past or remaining
        return { ...order, daysPassed };
    });

    const lateOrders = ordersWithDaysPassed.filter(order => order.daysPassed < 0 && order.runningStatus !== "COMPLETED");
    const onTimeOrders = ordersWithDaysPassed.filter(order => order.daysPassed >= 0 || order.runningStatus === "COMPLETED");

    // Scatter plot data to visualize deadlines and how many days are left or passed
    const getDeadlineScatterChartData = (): ChartData<"scatter"> => {
        return {
            datasets: [
                {
                    label: "Orders Deadline Status",
                    data: ordersWithDaysPassed.map(order => ({
                        x: order.daysPassed, // Days past or remaining
                        y: Math.random() * 10, // Random Y-value to avoid overlapping points
                        orderName: order.orderName, // Store order name to display in tooltip
                    })),
                    backgroundColor: ordersWithDaysPassed.map(order =>
                        order.daysPassed < 0 && order.runningStatus !== "COMPLETED" ? "#FF4C4C" : "#4CAF50"
                    ), // Red for late, green for on-time
                    borderColor: "#fff",
                    pointRadius: 10,
                },
            ],
        };
    };

    // Scatter chart options with a background and better readability
    const scatterChartOptions: ChartOptions<"scatter"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Days Past/Remaining (Relative to Deadline)",
                    color: "#333", // Darker title color for better readability
                },
                grid: {
                    display: false,
                },
                beginAtZero: false,
                ticks: {
                    color: "#666", // Darker ticks
                },
            },
            y: {
                display: false, // Hide Y-axis since it’s just random spacing
            },
        },
        plugins: {
            legend: {
                display: false, // We don't need a legend for this chart
            },
            tooltip: {
                callbacks: {
                    // Show order names in the tooltip along with days past/remaining
                    label: (tooltipItem) => {
                        const order = ordersWithDaysPassed[tooltipItem.dataIndex];
                        const days = order.daysPassed;
                        const status = days < 0
                            ? `${Math.abs(days)} days overdue`
                            : `${days} days remaining`;
                        return `${order.orderName}: ${status}`;
                    },
                },
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderColor: "#fff",
                borderWidth: 2,
                titleFont: { size: 16, weight: "bold" },
            },
        },
    };

    // Doughnut chart data for order status (completed, ongoing, on hold)
    const getOrderStatusData = (): ChartData<"doughnut"> => {
        const done = filteredOrders.filter(order => order.runningStatus === "COMPLETED").length;
        const onHold = filteredOrders.filter(order => order.runningStatus === "ONHOLD").length;
        const onGoing = filteredOrders.filter(order => order.runningStatus === "ONGOING").length;
        const Pending = filteredOrders.filter(order => order.runningStatus === "PENDING").length;

        return {
            labels: [`Completed (${done})`, `On Hold (${onHold})`, `Ongoing (${onGoing})`, `Pending (${Pending})`],
            datasets: [
                {
                    label: "Order Status",
                    data: [done, onHold, onGoing, Pending],
                    backgroundColor: ["#007BFF", "#FF4500", "#28A745", "#FFA500" ], // Blue, Yellow, Green colors for a modern look
                    borderColor: "#fff",
                    borderWidth: 2,
                    hoverOffset: 4,
                },
            ],
        };
    };

    // Doughnut chart options for the order status
    const doughnutOptions: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14,
                    },
                    color: "#333",
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
            {/* Dropdown to select time period */}
            <div className="w-full md:w-1/3 text-right mb-4"> {/* Moved to the right */}
                <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value)}>
                    <SelectTrigger className="w-[200px] bg-white border-gray-400 text-black shadow-md hover:bg-gray-100">
                        <SelectValue placeholder="Select Time Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectGroup>
                            <SelectItem value="daily">{t("Daily")}</SelectItem>
                            <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                            <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                            <SelectItem value="yearly">{t("Yearly")}</SelectItem>
                            <SelectItem value="all">{t("All Orders")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Display the counts of orders */}
            <div className="text-center space-y-2">
                <p className="text-xl font-bold">Late Orders: {lateOrders.length}</p>
                <p className="text-xl font-bold">On-Time Orders: {onTimeOrders.length}</p>
            </div>

            {/* Chart Container - Side by Side Layout */}
            <div className="flex flex-col lg:flex-row justify-center gap-8">
                {/* Doughnut Chart for Order Status */}
                <div className="w-full lg:w-1/2 h-[300px] p-4 bg-gray-100 rounded-lg shadow-lg">
                    <Doughnut data={getOrderStatusData()} options={doughnutOptions} />
                </div>

                {/* Scatter Chart for Deadline Status */}
                <div className="w-full lg:w-1/2 h-[300px] p-4 bg-gray-100 rounded-lg shadow-lg">
                    <Scatter data={getDeadlineScatterChartData()} options={scatterChartOptions} />
                </div>
            </div>
        </div>
    );
}
