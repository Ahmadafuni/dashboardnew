import CompletedTable from "@/components/DashboradComponents/Dashboard/CompletedTable";
import CuttingSendForConfirmationModal from "@/components/DashboradComponents/Dashboard/CuttingSendForConfirmationModal";
import OnConfirmationTable from "@/components/DashboradComponents/Dashboard/OnConfirmationTable";
import OngoingTable from "@/components/DashboradComponents/Dashboard/OngoingTable.tsx";
import OthersSendForConfirmation from "@/components/DashboradComponents/Dashboard/OthersSendForConfirmation";
import PausingUnpausingReasoneModal from "@/components/DashboradComponents/Dashboard/PausingUnpausingReasoneModal";
import RejectVariantDialog from "@/components/DashboradComponents/Dashboard/RejectVariantDialog";
import { Separator } from "@/components/ui/separator";
import { getAllWork } from "@/services/Dashboard.services";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AwaitingTable from "@/components/DashboradComponents/Dashboard/AwaitingTable.tsx";

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
            const sizes = works.inProgress[0].ModelVariant.Sizes
                ? JSON.parse(works.inProgress[0].ModelVariant.Sizes).map((e: any) => e.label)
                : [];
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
            <AwaitingTable setWorks={setWorks} works={works} />
            <OngoingTable works={works} setWorks={setWorks} />
            <OnConfirmationTable works={works} />
            <CompletedTable works={works} />
        </div>
    );
}
