import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "i18next";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function ModelBarChart(props: any) {
  const chartData = {
    labels: props.labels[props.type] || [], // Get labels based on the selected type
    datasets: [
      {
        label: t("ModelsAwaiting"),
        data: Array(props.labels[props.type]?.length).fill(props.data.PENDING || 0), // Fill data array with PENDING value
        backgroundColor: "rgba(255, 205, 86, 0.5)",
        borderColor: "rgba(255, 205, 86, 1)",
      },
      {
        label: t("ModelsInProgress"),
        data: Array(props.labels[props.type]?.length).fill(props.data.ONGOING || 0), // Fill data array with ONGOING value
        backgroundColor: "rgba(255,99,132,0.5)",
        borderColor: "rgba(255,99,132, 1)",
      },
      {
        label: t("ModelsDone"),
        data: Array(props.labels[props.type]?.length).fill(props.data.COMPLETED || 0), // Fill data array with COMPLETED value
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: t("ModelsOnHold"),
        data: Array(props.labels[props.type]?.length).fill(props.data.ONHOLD || 0), // Fill data array with ONHOLD value
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  return (
      <div>
        <div className="flex justify-end">
          <Select
              defaultValue={props.type || "monthly"} // Use default or received type
              onValueChange={(value) => {
                props.setType(value);
              }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Select Time Span")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="daily">{t("Daily")}</SelectItem>
                <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                <SelectItem value="monthly">{t("Monthly")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Check if data exists before rendering the chart */}
        {props.labels[props.type]?.length > 0 ? (
            <Bar data={chartData} />
        ) : (
            <p>{t("No data available")}</p>
        )}
      </div>
  );
}
