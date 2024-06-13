import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ArcElement
);

export default function CollectionPieChart() {
  const data = {
    labels: ["In Progress", "Completed", "Awaiting"],
    datasets: [
      {
        label: "Order Status",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div>
      <div className="flex justify-end">
        <Select defaultValue="Monthly">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Time Span" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Pie data={data} />
    </div>
  );
}
