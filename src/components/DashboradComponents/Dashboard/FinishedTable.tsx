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
import { differenceInDays, differenceInHours } from "date-fns";
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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Dispatch, SetStateAction, useEffect , useState } from "react";
import axios from "axios";
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



  const fetchSummary = async (modelVariantId: number) => {
    try {
      const response = await axios.get(`/model/testModel/${modelVariantId}`);
      setSummaryData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch summary", error);
    } finally {
    }
  };

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
  
  const calculateDuration = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    const hours = differenceInHours(end, start) % 24;
    return `${days}d ${hours}h`;
  };

  const renderAdminRow = (item: any) => (
    <>
      <TableCell>{item.CurrentStage?.Department?.Name || t("NA")}</TableCell>
      <TableCell>
        {item.StartTime && item.EndTime
          ? calculateDuration(new Date(item.StartTime), new Date(item.EndTime))
          : t("NA")}
      </TableCell>
      <TableCell>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(`/models/viewdetails/${item.ModelVariant.Model.Id}`, "_blank")
                }
              >
                {t("Details")}
              </Button>

              <Button
                variant="secondary"
                onClick={() => fetchSummary(item.ModelVariant.Id)}
              >
                {t("Summary")}
              </Button>
           </div>
      </TableCell>
    </>
  );

  const renderUserRow = (item: any) => (
    <>
      {user?.category === "CUTTING" ? (
        <TableCell>{renderQuantity(item.QuantityInKg)} Kg</TableCell>
      ) : (
        <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
      )}
      <TableCell>
        {item?.QuantityInKg != null ? (
          <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
        ) : (
          <TableCell>{renderQuantity(item.QuantityDelivered)}</TableCell>
        )}
      </TableCell>
      <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>
      <TableCell>
        <Button
          variant="secondary"
          onClick={() =>
            window.open(
              `/models/viewdetails/${item.ModelVariant.Model.Id}`,
              "_blank"
            )
          }
        >
          {t("Details")}
        </Button>
      </TableCell>
    </>
  );

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
            <TableHead onClick={() => requestSort("Model.DemoModelNumber")}>
                {t("ModelNumber")}
                {sortConfig?.key === "Model.DemoModelNumber" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("Barcode")}>
                {t("Barcode")}
                {sortConfig?.key === "Barcode" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("name")}>
                {t("Name")}
                {sortConfig?.key === "name" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("CollectionName")}>
                {t("Collections")}
                {sortConfig?.key === "CollectionName" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("OrderNumber")}>
                {t("OrderNumber")}
                {sortConfig?.key === "OrderNumber" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("TextileName")}>
                {t("TextileName")}
                {sortConfig?.key === "TextileName" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("ModelVariant.Color.ColorName")}>
                {t("Color")}
                {sortConfig?.key === "ModelVariant.Color.ColorName" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>

              <TableHead onClick={() => requestSort("ModelVariant.Sizes")}>
                {t("Sizes")}
                {sortConfig?.key === "ModelVariant.Sizes" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>

              <TableHead onClick={() => requestSort("ModelVariant.Quantity")}>
                {t("TargetQuantity")}
                {sortConfig?.key === "ModelVariant.Quantity" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                <>
                    <TableHead onClick={() => requestSort("CurrentStage.Department.Name")}>
                    {t("CurrentStage")}
                    {sortConfig?.key === "CurrentStage.Department.Name" && (
                      sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                    )}
                  </TableHead>
                  <TableHead onClick={() => requestSort("StartTime")}>
                  {t("Duration")}
                  {sortConfig?.key === "StartTime" && (
                    sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                  )}
                </TableHead>
                  
                  <TableHead>{t("Action")}</TableHead>
                </>
              ) : (
                <>
                <TableHead onClick={() => requestSort("QuantityReceived")}>
                  {t("ReceivedQuantity")}
                  {sortConfig?.key === "QuantityReceived" && (
                    sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                  )}
                </TableHead>
                  <TableHead>{t("DeliveredQuantity")}</TableHead>
                  <TableHead>{t("DamageQuantity")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                </>
              )}
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
                  <TableRow key={item.Id}>
                    {/* Model Number */}
                    <TableCell className="font-medium">
                      {item.DemoModelNumber}
                    </TableCell>

                    {/* Barcode */}
                    <TableCell className="font-medium">{item.Barcode || t("N/A")}</TableCell>

                    {/* Model Name */}
                    <TableCell className="font-medium">{item.ModelName}</TableCell>

                    {/* Collections */}
                    <TableCell className="font-medium">{item.Order?.Collection.CollectionName || t("N/A")}</TableCell>

                    {/* Order Number */}
                    <TableCell className="font-medium">{item.Order?.OrderName}</TableCell>

                    {/* Textile Name */}
                    <TableCell className="font-medium">{item.Textile?.TextileName || t("N/A")}</TableCell>

                    {/* Color */}
                    <TableCell className="font-medium">
                      {item.ModelVarients[0]?.Color?.ColorName || t("N/A")}
                    </TableCell>



                    {/* Target Quantity */}
                    <TableCell className="font-medium">
                      {item.ModelVarients[0]?.Quantity || t("N/A")}
                    </TableCell>

                    {/* Conditional rendering for roles */}
                    {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                        ? renderAdminRow(item)
                        : renderUserRow(item)}
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
            {/* <span className="text-sm text-gray-600">Showing </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
