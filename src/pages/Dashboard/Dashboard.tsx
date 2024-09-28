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


import { Dialog as DialogSec , DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useRecoilValue(userInfo);
  const [works, setWorks] = useState<WorkType>({
    awaiting: [],
    inProgress: [],
    completed: [],
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

  useEffect(() => {
    if (user?.userRole === "FACTORYMANAGER") {
      getAllTracking(pages, sizes, setWorks, setTotalPages, setIsLoading);
      getModelDetailsManager(setModelDetails , setIsLoading);
    } else {
      getAllWork(pages, sizes, setWorks, setTotalPages, setIsLoading);
      getModelDetailsDepartment(setModelDetails , setIsLoading);
    }
  }, [user, pages, sizes]);

  
  const hasNullNextStage = (workList: any) => {
    return workList.some((item: { NextStage: null }) => item.NextStage === null);
  };

  const hideConfirmationTable = !(
    user?.userRole === "FACTORYMANAGER" ||
    (!hasNullNextStage(works.awaiting) &&
      !hasNullNextStage(works.inProgress) &&
      !hasNullNextStage(works.completed) &&
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
          <DialogContent className="sm:max-w-[600px] bg-gray-800">
            <DialogHeader>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{t("ModelDetails")}</h2>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table className="min-w-full border border-gray-600">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">{"حالة العمل"}</TableHead>
                    <TableHead className="text-gray-300">{"عدد الموديلات"}</TableHead>
                    <TableHead className="text-gray-300">{"كمية المنتجات المستلمة"}</TableHead>
                    <TableHead className="text-gray-300">{"كمية المنتجات المسلمة"}</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-gray-700">
                    <TableCell className="text-gray-300">{"جاهز للعمل"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.awaitingModels} {"موديل"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.awaitingReceivedQuantity} {"قطعة"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.awaitingDeliveredQuantity} {"قطعة"}</TableCell>

                  </TableRow>
                  <TableRow className="hover:bg-gray-700">
                    <TableCell className="text-gray-300">{"جار العمل"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.inProgressModels} {"موديل"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.inProgressReceivedQuantity} {"قطعة"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.inProgressDeliveredQuantity} {"قطعة"}</TableCell>

                  </TableRow>
                  <TableRow className="hover:bg-gray-700">
                    <TableCell className="text-gray-300">{"في انتظار التأكيد"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.givingConfirmationModels} {"موديل"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.givingConfirmationReceivedQuantity} {"قطعة"}</TableCell>
                    <TableCell className="text-gray-300">{modelDetails.givingConfirmationDeliveredQuantity} {"قطعة"}</TableCell>

                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={closeModal} className="bg-gray-600 text-gray-200 hover:bg-gray-500">
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
    </div>
  );
}
