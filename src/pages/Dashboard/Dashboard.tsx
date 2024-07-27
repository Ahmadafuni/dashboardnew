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
import CompleteDialog from "@/components/DashboradComponents/Dashboard/CompleteDialog.tsx";

export default function Dashboard() {
    const { t } = useTranslation();

    const [works, setWorks] = useState<WorkType>({
        awaiting: [],
        inProgress: [],
        completed: [],
        givingConfirmation: [],
    });

    const hasNullNextStage = (workList: any) => {
        return workList.some((item: { NextStage: null; }) => item.NextStage === null);
    };

    const hideConfirmationTable = hasNullNextStage(works.awaiting) ||
        hasNullNextStage(works.inProgress) ||
        hasNullNextStage(works.completed) ||
        hasNullNextStage(works.givingConfirmation);


    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [quantityReceived, setQuantityReceived] = useState<any[]>([]); // State to hold the quantity received data

    useEffect(() => {
        getAllWork(setWorks);
    }, []);

    return (
        <div className="w-full p-4 space-y-6">
            <PausingUnpausingReasoneModal getAllWorks={() => getAllWork(setWorks)} />
            <CuttingSendForConfirmationModal
                getAllWorks={() => getAllWork(setWorks)}
                selectedSizes={selectedSizes}
            />
            <OthersSendForConfirmation
                getAllWorks={() => getAllWork(setWorks)}
                selectedSizes={selectedSizes}
                quantityReceived={quantityReceived}
            />
            <CompleteDialog
                getAllWorks={() => getAllWork(setWorks)}
                selectedSizes={selectedSizes}
                quantityReceived={quantityReceived}
            />
            <RejectVariantDialog getWorks={() => getAllWork(setWorks)} />
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{t("Dashboard")}</h1>
                <Separator />
            </div>
            <AwaitingTable setWorks={setWorks} works={works} />
            <OngoingTable
                works={works}
                setWorks={setWorks}
                setSelectedSizes={setSelectedSizes}
                setQuantityReceived={setQuantityReceived} // Pass the setter for quantity received
            />
            {!hideConfirmationTable && <OnConfirmationTable works={works} />}
            <CompletedTable works={works} />
        </div>
    );
}
