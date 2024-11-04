import CompletedTable from "@/components/DashboradComponents/Dashboard/CompletedTable";
import CuttingSendForConfirmationModal from "@/components/DashboradComponents/Dashboard/CuttingSendForConfirmationModal";
import OnConfirmationTable from "@/components/DashboradComponents/Dashboard/OnConfirmationTable";
import OngoingTable from "@/components/DashboradComponents/Dashboard/OngoingTable.tsx";
import OthersSendForConfirmation from "@/components/DashboradComponents/Dashboard/OthersSendForConfirmation";
import PausingUnpausingReasoneModal from "@/components/DashboradComponents/Dashboard/PausingUnpausingReasoneModal";
import RejectVariantDialog from "@/components/DashboradComponents/Dashboard/RejectVariantDialog";
import { Separator } from "@/components/ui/separator";
import {  getAllTracking , getAllWork, getModelDetailsDepartment, getModelDetailsManager } from "@/services/Dashboard.services";
import {  WorkType } from "@/types/Dashboard/Dashboard.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AwaitingTable from "@/components/DashboradComponents/Dashboard/AwaitingTable.tsx";
import CompleteDialog from "@/components/DashboradComponents/Dashboard/CompleteDialog.tsx";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import * as Dialog from '@radix-ui/react-dialog';


import { Dialog as DialogSec , DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "lucide-react";
import FinishedTable from "@/components/DashboradComponents/Dashboard/FinishedTable.tsx";

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useRecoilValue(userInfo);
  const [works, setWorks] = useState<WorkType>({
    awaiting: [],
    inProgress: [],
    completed: [],
    finished: [],
    givingConfirmation: [],
  });


  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelDetails, setModelDetails] = useState({
    awaitingModels:0,
    awaitingDeliveredQuantity:0,
    awaitingReceivedQuantity:0,
    inProgressModels:0,
    inProgressDeliveredQuantity:0,
    inProgressReceivedQuantity:0,
    completedModels:0,
    completedDeliveredQuantity:0,
    completedReceivedQuantity:0,
    givingConfirmationModels:0,
    givingConfirmationDeliveredQuantity:0,
    givingConfirmationReceivedQuantity:0
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedSizes, setSelectedSizes] = useState<{ label: string, value: string }[]>([]);
  const [quantityReceived, setQuantityReceived] = useState<any[]>([]);
  const [pages, setPages] = useState({
    awaitingPage: 1,
    inProgressPage: 1,
    completedPage: 1,
    finishedPage: 1,
    givingConfirmationPage: 1,
  });
  const [sizes, setSizes] = useState({
    awaitingSize: 10,
    inProgressSize: 10,
    completedSize: 10,
    finishedSize: 10,
    givingConfirmationSize: 10,
  });
  const [totalPages, setTotalPages] = useState({
    totalPagesAwaiting: 1,
    totalPagesInProgress: 1,
    totalPagesCompleted: 1,
    totalPagesFinished: 1,
    totalPagesGivingConfirmation: 1,
  });

  useEffect(() => {
    if (user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING") {

      getAllTracking(pages, sizes, setWorks, setTotalPages, setIsLoading);
      getModelDetailsManager(setModelDetails , setIsLoading);
    } else {
      getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading);
      getModelDetailsDepartment(setModelDetails , setIsLoading);
    }

  }, [user, pages, sizes ]);
  
  const hasNullNextStage = (workList: any) => {

    if(workList)
      return workList.some((item: { NextStage: null }) => item.NextStage === null);
    
  };

  const hideConfirmationTable = !(
    user?.userRole === "FACTORYMANAGER" ||
    (!hasNullNextStage(works.awaiting) &&
      !hasNullNextStage(works.inProgress) &&
      !hasNullNextStage(works.completed) &&
      // !hasNullNextStage(works.finished) &&
      !hasNullNextStage(works.givingConfirmation))
  );

  const showFinishTable = !(
      user?.userRole === "FACTORYMANAGER" ||
          (!hasNullNextStage(works.awaiting) &&
          !hasNullNextStage(works.inProgress) &&
          !hasNullNextStage(works.completed) &&
          !hasNullNextStage(works.finished) &&
          !hasNullNextStage(works.givingConfirmation))
  );

  return (
    <div className="w-full p-4 space-y-6">
      <PausingUnpausingReasoneModal
        getAllWorks={() => getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading)}
      />
      <CuttingSendForConfirmationModal
          getAllWorks={() => getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading)}
        selectedSizes={selectedSizes}
      />
      <OthersSendForConfirmation
          getAllWorks={() => getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading)}
        selectedSizes={selectedSizes}
        quantityReceived={quantityReceived}
      />
      <CompleteDialog
        getAllWorks={() => getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading)}
        selectedSizes={selectedSizes}
        quantityReceived={quantityReceived}
      />
      <RejectVariantDialog
        getWorks={() => getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading)}
      />

      <div className="w-full p-4 space-y-6">
        <div className="space-y-2 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("Dashboard")}</h1>
          <Button variant="outline" onClick={openModal}>
            عرض تفاصيل الموديلات
          </Button>
        </div>

        <DialogSec open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>{t("ModelDetails")}</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{"حالة العمل"}</TableHead>
                    <TableHead >{"عدد الموديلات"}</TableHead>
                    <TableHead >{"كمية المنتجات المستلمة"}</TableHead>
                    <TableHead >{"كمية المنتجات المسلمة"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow >
                    <TableCell >{"جاهز للعمل"}</TableCell>
                    <TableCell >{modelDetails.awaitingModels} {"موديل"}</TableCell>
                    <TableCell >{modelDetails.awaitingReceivedQuantity} {"قطعة"}</TableCell>
                    <TableCell >{modelDetails.awaitingDeliveredQuantity} {"قطعة"}</TableCell>

                  </TableRow>
                  <TableRow >
                    <TableCell >{"جار العمل"}</TableCell>
                    <TableCell >{modelDetails.inProgressModels} {"موديل"}</TableCell>
                    <TableCell >{modelDetails.inProgressReceivedQuantity} {"قطعة"}</TableCell>
                    <TableCell >{modelDetails.inProgressDeliveredQuantity} {"قطعة"}</TableCell>

                  </TableRow>
                  <TableRow>
                    <TableCell >{"في انتظار التأكيد"}</TableCell>
                    <TableCell >{modelDetails.givingConfirmationModels} {"موديل"}</TableCell>
                    <TableCell >{modelDetails.givingConfirmationReceivedQuantity} {"قطعة"}</TableCell>
                    <TableCell >{modelDetails.givingConfirmationDeliveredQuantity} {"قطعة"}</TableCell>

                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={closeModal}>
                {t("Close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogSec>
      </div>

      <Separator />

      <div id="datatable" className="mt-10" style={{ position: "relative", top: "50%" }}>
        {isLoading && 
            <Dialog.Root open={isLoading}>
                    <Dialog.Overlay className="fixed inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 opacity-40 animate-pulse z-50" />
                    
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 animate-fade-in z-50">
                        <div className="flex flex-col items-center">
                            <Loader className="w-16 h-16 animate-spin text-blue-600" />
                            
                            <p className="text-lg font-semibold mt-4 text-gray-700">
                                {t("Loading...")}
                            </p>

                            <p className="text-sm mt-2 text-gray-500">
                                {t("Please wait, your request is being processed now.")}
                            </p>
                        </div>
                    </Dialog.Content>
                </Dialog.Root>}
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
      {!showFinishTable && (user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING") && (
      <FinishedTable
          page={pages.finishedPage}
          setPage={setPages}
          size={sizes.finishedSize}
          setSize={setSizes}
          totalPages={totalPages.totalPagesFinished}
          works={works}
      />
      )}
    </div>
  );
}
