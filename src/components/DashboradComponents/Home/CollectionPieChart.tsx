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

export default function CollectionPieChart(props: any) {
  const data = {
    labels: ["Pending", "On Going", "Completed"],
    datasets: [
      {
        label: "Collections Status",
        data: [
          props.statsData.PENDING,
          props.statsData.ONGOING,
          props.statsData.COMPLETED,
        ],
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
        <Select
          defaultValue="monthly"
          onValueChange={(value) => {
            props.setType(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Time Span" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Pie data={data} />
    </div>
  );
}
