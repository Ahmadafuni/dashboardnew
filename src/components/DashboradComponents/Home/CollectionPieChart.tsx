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
import { t } from "i18next";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement);

export default function CollectionPieChart(props: any) {
  const data = {
    labels: [t("Pending"), t("OnGoing"), t("Completed"), t("OnHold")], // Added "OnHold" label
    datasets: [
      {
        label: t("CollectionsStatus"),
        data: [
          props.statsData.PENDING,
          props.statsData.ONGOING,
          props.statsData.COMPLETED,
          props.statsData.ONHOLD, // Added "OnHold" data
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",   // Pending color
          "rgb(54, 162, 235)",   // OnGoing color
          "rgb(255, 205, 86)",   // Completed color
          "rgb(153, 102, 255)",  // OnHold color
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
                <SelectItem value="daily">{t("Daily")}</SelectItem>
                <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                <SelectItem value="monthly">{t("Monthly")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pie data={data} />
      </div>
  );
}
