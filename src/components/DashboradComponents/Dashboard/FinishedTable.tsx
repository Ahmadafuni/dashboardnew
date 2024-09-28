import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect , useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";

interface Props {
  page: number;
  setPage: Dispatch<
    SetStateAction<{
      awaitingPage: number;
      inProgressPage: number;
      completedPage: number;
      finishedPage: number;
      givingConfirmationPage: number;
    }>
  >;
  size: number;
  setSize: Dispatch<
    SetStateAction<{
      awaitingSize: number;
      inProgressSize: number;
      completedSize: number;
      finishedSize: number;
      givingConfirmationSize: number;
    }>
  >;
  totalPages: number;

  works: WorkType;
}

export default function FinishedTable({
  page,
  setPage,
  size,
  setSize,
  totalPages,
  works,
}: Props) {
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;
  const { t } = useTranslation();

  const [summaryData, setSummaryData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);


  const sortedWorks = Array.isArray(works?.finished) ? [...works.finished].sort((a, b) => {

    if (sortConfig !== null) {
      const keyParts = sortConfig.key.split('.');
      const getValue = (obj: any, keyParts: string[]) => {
        return keyParts.reduce((nestedObj, key) => {
          return nestedObj && nestedObj[key] !== undefined ? nestedObj[key] : null;
        }, obj);
      };

      const aValue = getValue(a, keyParts);
      const bValue = getValue(b, keyParts);

      if (aValue !== null && bValue !== null) {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
            : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        } else {
          return 0;
        }
      }

      if (aValue === null && bValue !== null) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue !== null && bValue === null) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;

  }) : [];

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // @ts-ignore
  const [pageSize, setPageSize] = useState(10);

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  useEffect(() => {

  }, [works]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSummaryData(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("Finished")}</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('modelDemoNumber')}>{t('ModelNumber')}</TableHead>
              <TableHead onClick={() => requestSort('modelBarcode')}>{t('Barcode')}</TableHead>
              <TableHead onClick={() => requestSort('modelName')}>{t('Name')}</TableHead>
              <TableHead onClick={() => requestSort('collectionName')}>{t('Collections')}</TableHead>
              <TableHead onClick={() => requestSort('orderName')}>{t('OrderNumber')}</TableHead>
              <TableHead onClick={() => requestSort('textileName')}>{t('TextileName')}</TableHead>
              <TableHead onClick={() => requestSort('colors')}>{t('Color')}</TableHead>
              <TableHead onClick={() => requestSort('sizes')}>{t('Sizes')}</TableHead>
              <TableHead onClick={() => requestSort('QuantityReceived')}>{t('ReceivedQuantity')}</TableHead>
              <TableHead onClick={() => requestSort('QuantityDelivered')}>{t('DeliveredQuantity')}</TableHead>
              <TableHead onClick={() => requestSort('duration')}>{t('Duration')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works && sortedWorks.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                      ? 12
                      : 8
                  }
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
            {works &&
              sortedWorks.map((item: any) => (
                  <TableRow key={item.modelId}>
                    <TableCell className="font-medium">{item.modelDemoNumber}</TableCell>
                    <TableCell className="font-medium">{item.modelBarcode || t('N/A')}</TableCell>
                    <TableCell className="font-medium">{item.modelName}</TableCell>
                    <TableCell className="font-medium">{item.collectionName}</TableCell>
                    <TableCell className="font-medium">{item.orderName}</TableCell>
                    <TableCell className="font-medium">{item.textileName}</TableCell>
                    <TableCell className="font-medium">{item.colors}</TableCell>
                    <TableCell className="font-medium">{item.sizes}</TableCell>
                    <TableCell className="font-medium">{item.QuantityReceived}</TableCell>
                    <TableCell className="font-medium">{item.QuantityDelivered}</TableCell>
                    <TableCell className="font-medium">{item.duration}</TableCell>
                  </TableRow>
              ))}
          </TableBody>
        </Table>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-gray-800">
            <DialogHeader>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                {t("Stage Summary")}
              </h2>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table className="min-w-full border border-gray-600">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">{t("Stage Name")}</TableHead>
                    <TableHead className="text-gray-300">{t("Start Time")}</TableHead>
                    <TableHead className="text-gray-300">{t("End Time")}</TableHead>
                    <TableHead className="text-gray-300">{t("Duration (hours)")}</TableHead>
                    <TableHead className="text-gray-300">{t("Quantity Received")}</TableHead>
                    <TableHead className="text-gray-300">{t("Quantity Delivered")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryData?.stages.map((stage: any, index: number) => (
                    <TableRow key={index} className="hover:bg-gray-700">
                      <TableCell className="text-gray-300">{stage.stageName}</TableCell>
                      <TableCell className="text-gray-300">{new Date(stage.startTime).toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">{new Date(stage.endTime).toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">{stage.duration}</TableCell>
                      <TableCell className="text-gray-300">
                        {renderQuantity(stage.quantityReceived)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {renderQuantity(stage.quantityDelivered)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                {t("Close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (page > 1) {
                  setPage((prev) => ({
                    ...prev,
                    finishedPage: prev.finishedPage - 1,
                  }));
                }
              }}
              disabled={page == 1}
              className="mr-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                if (page < totalPages) {
                  setPage((prev) => ({
                    ...prev,
                    finishedPage: prev.finishedPage + 1,
                  }));
                }
              }}
              disabled={page == totalPages}
              className="mr-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 mr-2">
              Page {page} of {totalPages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={size.toString()}
              onValueChange={(value) =>
                setSize((prev) => ({ ...prev, finishedSize: Number(value) }))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder={size.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectScrollUpButton />
                {[2, 5, 10, 20, 40, 50].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s}
                  </SelectItem>
                ))}
                <SelectScrollDownButton />
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
