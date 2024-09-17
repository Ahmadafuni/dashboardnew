import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userInfo } from "@/store/authentication";
import {
  completeModal,
  currentTrackingId,
  currentVariantId,
  cuttingSendConfirmationModal,
  othersSendConfirmationModal,
} from "@/store/dashboard";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { format } from "date-fns";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog.tsx";
import {
  holdModelVarinte,
  restartModelVarinte,
} from "@/services/ModelVarients.services.ts";
import { getAllWork } from "@/services/Dashboard.services.ts";
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

interface Props {
  page: number;
  setPage: Dispatch<
    SetStateAction<{
      awaitingPage: number;
      inProgressPage: number;
      completedPage: number;
      givingConfirmationPage: number;
    }>
  >;
  size: number;
  setSize: Dispatch<
    SetStateAction<{
      awaitingSize: number;
      inProgressSize: number;
      completedSize: number;
      givingConfirmationSize: number;
    }>
  >;
  
  totalPages: number;
  works: WorkType;
  setWorks: (data: any) => void;
  setSelectedSizes: (sizes: string[]) => void;
  setQuantityReceived: (quantity: any[]) => void;
}

export default function OngoingTable({
  page,
  setPage,
  size,
  setSize,
  totalPages,
  works,
  setWorks,
  setSelectedSizes,
  setQuantityReceived,
}: Props) {
  const { t } = useTranslation();

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const sortedWorks = [...works.inProgress].sort((a, b) => {
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
  });
  
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };


  const renderQuantity = (quantity: any) => {
    console.log("quantity : ", quantity);

    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  const setCurrentVariant = useSetRecoilState(currentVariantId);
  const setCurrentTrackingId = useSetRecoilState(currentTrackingId);
  const setCuttingConfirmation = useSetRecoilState(
    cuttingSendConfirmationModal
  );
  const setConfirmationOthers = useSetRecoilState(othersSendConfirmationModal);
  const setComplete = useSetRecoilState(completeModal);
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;

  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    if (actionInProgress) {
      fetchWorks();
      setActionInProgress(false); // Reset the state variable
    }
  }, [actionInProgress]);

  const fetchWorks = async () => {
    // @ts-ignore
    await getAllWork({}, {}, setWorks);
  };

  const handleSendConfirmation = (item: any, type: string) => {
    console.log("Sizes for confirmation are : ", item.ModelVariant.Sizes);
    const sizes = item.ModelVariant.Sizes
      ? JSON.parse(item.ModelVariant.Sizes)
      : //   .map((e: any) => e.label)
      [];

    const quantityReceived = item.QuantityReceived || [];
    setSelectedSizes(sizes);
    setQuantityReceived(quantityReceived);
    setCurrentVariant(item.ModelVariant.Id);
    if (type === "CONFIRMATION") setConfirmationOthers(true);
    else if (type === "COMPLETE") {
      setCurrentTrackingId(item.Id);
      setComplete(true);
    }
  };

  const handleSendCuttingConfirmation = (item: any) => {
    const sizes = item.ModelVariant.Sizes
      ? JSON.parse(item.ModelVariant.Sizes)
      : //   .map((e: any) => e.label)
      [];
    setSelectedSizes(sizes);
    setCurrentVariant(item.ModelVariant.Id);
    setCuttingConfirmation(true);
  };

  const handlePause = async (item: any, reason: string) => {
    if (item.ModelVariant.Id && item.ModelVariant.Model?.Id) {
      await holdModelVarinte(
        setCurrentVariant,
        item.ModelVariant.Id,
        reason,
        item.ModelVariant.Model.Id
      );
      setActionInProgress(true);
    }
  };

  const handleRestart = async (item: any) => {
    if (item.ModelVariant.Id && item.ModelVariant.Model?.Id) {
      await restartModelVarinte(
        setCurrentVariant,
        item.ModelVariant.Id,
        item.ModelVariant.Model.Id
      );
      setActionInProgress(true);
    }
  };

  const renderAdminRow = (item: any) => (
    <>
      <TableCell>{item.CurrentStage?.Department?.Name || t("N/A")}</TableCell>
      <TableCell>{item.NextStage?.Department?.Name || t("N/A")}</TableCell>
      <TableCell>
        {item.StartTime
          ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss")
          : t("N/A")}
      </TableCell>
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

  const renderUserRow = (item: any) => (
    <>
      <TableCell>
        {item.StartTime && format(new Date(item.StartTime), "dd/MM/yyyy HH:mm")}
      </TableCell>
      <TableCell className="space-x-1 space-y-1">
        {item.ModelVariant.RunningStatus === "RUNNING" ? (
          <BasicConfirmationDialog
            key={`pause-${item.Id}`}
            btnText={t("Pause")}
            takeAction={async (reason: string) => {
              await handlePause(item, reason);
              setActionInProgress(true); // Ensure dialog resets after action
            }}
            className="bg-orange-500 hover:bg-orange-600"
            showInput={true}
          />
        ) : (
          <BasicConfirmationDialog
            key={`restart-${item.Id}`}
            btnText={t("Restart")}
            takeAction={async () => {
              await handleRestart(item);
              setActionInProgress(true); // Ensure dialog resets after action
            }}
            className="bg-green-500 hover:bg-green-600"
          />
        )}
        {user?.category === "CUTTING" ? (
          <Button onClick={() => handleSendCuttingConfirmation(item)}>
            {t("SendForConfirmation")}
          </Button>
        ) : user?.category !== "QUALITYASSURANCE" ? (
          <Button onClick={() => handleSendConfirmation(item, "CONFIRMATION")}>
            {t("SendForConfirmation")}
          </Button>
        ) : (
          <Button onClick={() => handleSendConfirmation(item, "COMPLETE")}>
            {t("Complete")}
          </Button>
        )}
      </TableCell>
    </>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("Ongoing")}</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
            <TableHead onClick={() => requestSort("ModelVariant.Model.DemoModelNumber")}>
                {t("ModelNumber")}
                {sortConfig?.key === "ModelVariant.Model.DemoModelNumber" && (
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
                {t("Textile")}
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

              <TableHead onClick={() => requestSort("QuantityReceived")}>
                {t("ReceivedQuantity")}
                {sortConfig?.key === "QuantityReceived" && (
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

                <TableHead onClick={() => requestSort("NextStage.Department.Name")}>
                  {t("NextStage")}
                  {sortConfig?.key === "NextStage.Department.Name" && (
                    sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                  )}
                </TableHead>

                <TableHead onClick={() => requestSort("StartTime")}>
                  {t("StartTime")}
                  {sortConfig?.key === "StartTime" && (
                    sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                  )}
                </TableHead>

                  <TableHead>{t("Action")}</TableHead>
                </>
              ) : (
                <>
                  <TableHead onClick={() => requestSort("StartTime")}>
                    {t("StartTime")}
                    {sortConfig?.key === "StartTime" && (
                      sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                    )}
                  </TableHead>
                  <TableHead>{t("Action")}</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>

            
            {works.inProgress.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                      ? 10
                      : 8
                  }
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
            {sortedWorks?.length > 0 &&
              sortedWorks?.map((item) => {
                const isPaused = item.ModelVariant.RunningStatus === "PAUSED";
                return (
                  <TableRow
                    key={item.Id}
                    style={isPaused ? { backgroundColor: "orange" } : {}}
                  >
                    <TableCell className="font-medium">
                      {item.ModelVariant.Model.DemoModelNumber || t("N/A")} 
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.Barcode || t("N/A")}
                    </TableCell>
                    <TableCell className="font-medium">{item.name || t("N/A")}</TableCell>
                    <TableCell className="font-medium">
                      {item.CollectionName || t("N/A")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.OrderName || t("N/A")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.TextileName || t("N/A")}
                    </TableCell>

                    <TableCell>{item.ModelVariant.Color.ColorName || t("N/A")}</TableCell>
                    <TableCell>
                      {JSON.parse(item.ModelVariant.Sizes || t("N/A"))
                        // .map((e: any) => e.label)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{item.ModelVariant.Quantity || t("N/A")}</TableCell>
                    <TableCell>
                      {renderQuantity(item.QuantityReceived)}
                    </TableCell>
                    {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                      ? renderAdminRow(item)
                      : renderUserRow(item)}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (page > 1) {
                  setPage((prev) => ({
                    ...prev,
                    inProgressPage: prev.inProgressPage - 1,
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
                    inProgressPage: prev.inProgressPage + 1,
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
                setSize((prev) => ({ ...prev, inProgressSize: Number(value) }))
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
