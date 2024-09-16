import CompletedTable from "@/components/DashboradComponents/Dashboard/CompletedTable";
import CuttingSendForConfirmationModal from "@/components/DashboradComponents/Dashboard/CuttingSendForConfirmationModal";
import OnConfirmationTable from "@/components/DashboradComponents/Dashboard/OnConfirmationTable";
import OngoingTable from "@/components/DashboradComponents/Dashboard/OngoingTable.tsx";
import OthersSendForConfirmation from "@/components/DashboradComponents/Dashboard/OthersSendForConfirmation";
import PausingUnpausingReasoneModal from "@/components/DashboradComponents/Dashboard/PausingUnpausingReasoneModal";
import RejectVariantDialog from "@/components/DashboradComponents/Dashboard/RejectVariantDialog";
import { Separator } from "@/components/ui/separator";
import { getAllTracking, getAllWork } from "@/services/Dashboard.services";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AwaitingTable from "@/components/DashboradComponents/Dashboard/AwaitingTable.tsx";
import CompleteDialog from "@/components/DashboradComponents/Dashboard/CompleteDialog.tsx";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import Spinner from "@/components/common/Spinner";

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useRecoilValue(userInfo);
  const [works, setWorks] = useState<WorkType>({
    awaiting: [],
    inProgress: [],
    completed: [],
    givingConfirmation: [],
  });
  const hasNullNextStage = (workList: any) => {
    return workList.some(
      (item: { NextStage: null }) => item.NextStage === null
    );
  };
  const hideConfirmationTable = !(
    user?.userRole === "FACTORYMANAGER" ||
    (!hasNullNextStage(works.awaiting) &&
      !hasNullNextStage(works.inProgress) &&
      !hasNullNextStage(works.completed) &&
      !hasNullNextStage(works.givingConfirmation))
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [quantityReceived, setQuantityReceived] = useState<any[]>([]); // State to hold the quantity received data
  const [pages, setPages] = useState({
    awaitingPage: 1,
    inProgressPage: 1,
    completedPage: 1,
    givingConfirmationPage: 1,
  });
  const [sizes, setSizes] = useState({
    awaitingSize: 10,
    inProgressSize: 10,
    completedSize: 10,
    givingConfirmationSize: 10,
  });
  const [totalPages, setTotalPages] = useState({
    totalPagesAwaiting: 1,
    totalPagesInProgress: 1,
    totalPagesCompleted: 1,
    totalPagesGivingConfirmation: 1,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.userRole === "FACTORYMANAGER") {
      getAllTracking(pages, sizes, setWorks, setTotalPages, setIsLoading);
    } else {
      getAllWork(setWorks, pages, sizes, setTotalPages, setIsLoading);
    }
  }, [user, pages, sizes]);

  return (
    <div className="w-full p-4 space-y-6">
      <PausingUnpausingReasoneModal
        getAllWorks={() =>
          getAllWork(setWorks, pages, sizes, setTotalPages, setIsLoading)
        }
      />
      <CuttingSendForConfirmationModal
        getAllWorks={() =>
          getAllWork(setWorks, pages, sizes, setTotalPages, setIsLoading)
        }
        selectedSizes={selectedSizes}
      />
      <OthersSendForConfirmation
        getAllWorks={() =>
          getAllWork(setWorks, pages, sizes, setTotalPages, setIsLoading)
        }
        selectedSizes={selectedSizes}
        quantityReceived={quantityReceived}
      />
      <CompleteDialog
        getAllWorks={() =>
          getAllWork(setWorks, pages, sizes, setTotalPages, setIsLoading)
        }
        selectedSizes={selectedSizes}
        quantityReceived={quantityReceived}
      />
      <RejectVariantDialog
        getWorks={() =>
          getAllWork(setWorks, pages, sizes, setTotalPages, setIsLoading)
        }
      />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t("Dashboard")}</h1>
        <Separator />
      </div>
      <div
        id="datatable"
        className="mt-10"
        style={{
          position: "relative",
          top: "50%",
        }}
      >
        {isLoading && <Spinner />}
      </div>
      <AwaitingTable
        page={pages.awaitingPage}
        setPage={setPages}
        size={sizes.awaitingSize}
        setSize={setSizes}
        totalPages={totalPages.totalPagesAwaiting}
        setWorks={setWorks}
        works={works}
      />
      <OngoingTable
        page={pages.inProgressPage}
        setPage={setPages}
        size={sizes.inProgressSize}
        setSize={setSizes}
        totalPages={totalPages.totalPagesInProgress}
        works={works}
        setWorks={setWorks}
        setSelectedSizes={setSelectedSizes}
        setQuantityReceived={setQuantityReceived}
      />
      {!hideConfirmationTable && (
        <OnConfirmationTable
          page={pages.givingConfirmationPage}
          setPage={setPages}
          size={sizes.givingConfirmationSize}
          setSize={setSizes}
          totalPages={totalPages.totalPagesGivingConfirmation}
          works={works}
        />
      )}
      <CompletedTable
        page={pages.completedPage}
        setPage={setPages}
        size={sizes.completedSize}
        setSize={setSizes}
        totalPages={totalPages.totalPagesCompleted}
        works={works}
      />
    </div>
  );
}
