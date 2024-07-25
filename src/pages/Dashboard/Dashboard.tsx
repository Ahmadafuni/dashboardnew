import AwaitingCuttingTable from "@/components/DashboradComponents/Dashboard/AwaitingCuttingTable";
import CompletedTable from "@/components/DashboradComponents/Dashboard/CompletedTable";
import CuttingSendForConfirmationModal from "@/components/DashboradComponents/Dashboard/CuttingSendForConfirmationModal";
import OnConfirmationTable from "@/components/DashboradComponents/Dashboard/OnConfirmationTable";
import OngoingCuttingTable from "@/components/DashboradComponents/Dashboard/OngoingCuttingTable";
import OthersSendForConfirmation from "@/components/DashboradComponents/Dashboard/OthersSendForConfirmation";
import PausingUnpausingReasoneModal from "@/components/DashboradComponents/Dashboard/PausingUnpausingReasoneModal";
import RejectVariantDialog from "@/components/DashboradComponents/Dashboard/RejectVariantDialog";
import { Separator } from "@/components/ui/separator";
import { getAllWork } from "@/services/Dashboard.services";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  const [works, setWorks] = useState<WorkType>({
    awaiting: [],
    inProgress: [],
    completed: [],
    givingConfirmation: [],
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);


  useEffect(() => {
    getAllWork(setWorks);
  }, []);

    useEffect(() => {
        if (works.inProgress.length > 0) {
            const sizes = JSON.parse(works.inProgress[0].ModelVariant.Sizes).map((e: any) => e.label);
            setSelectedSizes(sizes);
        }
    }, [works]);


  return (
    <div className="w-full p-4 space-y-6">
      <PausingUnpausingReasoneModal getAllWorks={() => getAllWork(setWorks)} />
      <CuttingSendForConfirmationModal getAllWorks={() => getAllWork(setWorks)} selectedSizes={selectedSizes} />
      <OthersSendForConfirmation getAllWorks={() => getAllWork(setWorks)} selectedSizes={selectedSizes} />
      <RejectVariantDialog getWorks={() => getAllWork(setWorks)} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t("Dashboard")}</h1>
        <Separator />
      </div>
      <AwaitingCuttingTable setWorks={setWorks} works={works} />
      <OngoingCuttingTable works={works} setWorks={setWorks} />
      <OnConfirmationTable works={works} />
      <CompletedTable works={works} />
    </div>
  );
}
