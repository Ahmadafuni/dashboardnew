import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  confirmVariant,
  rejectVariant,
  startVariant,
} from "@/services/Dashboard.services";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import ConfirmRejectAlertDialog from "./ConfirmRejectAlertDialog";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { useState, Dispatch, SetStateAction } from "react";

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
  setWorks: any;
}

export default function AwaitingTable({
  page,
  setPage,
  size,
  setSize,
  totalPages,
  works,
  setWorks,
}: Props) {
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;
  const { t } = useTranslation();

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const sortedWorks = [...works.awaiting].sort((a, b) => {
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
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
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
    <TableCell className="space-x-1 space-y-1">
      {item.MainStatus === "TODO" ? (
        <BasicConfirmationDialog
          btnText={t("Start")}
          takeAction={() => startVariant(setWorks, item.ModelVariant.Id)}
          className=""
        />
      ) : (
        <ConfirmRejectAlertDialog
          acceptVariant={() => confirmVariant(setWorks, item.Id)}
          rejectVariant={() => rejectVariant(setWorks, item.Id)}
          quantityReceivedFromPreviousDep={renderQuantity(
            item.QuantityInKg !== null
              ? item.QuantityInNum
              : item.QuantityDelivered
          )}
        />
      )}
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
  );

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("Awaiting")}</h2>
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
                {t("Quantity")}
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
                <TableHead>{t("Action")}</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedWorks.map((item) => {
              console.log("item.ModelVariant",item);
           const isPaused = item.ModelVariant.RunningStatus === "ONHOLD";
              return (
                <TableRow 
                key={item.Id} 
                style={isPaused ? { backgroundColor: "orange" } : {}}
                >
                  <TableCell>{item.ModelVariant?.Model?.DemoModelNumber || t("N/A")}</TableCell>
                  <TableCell>{item.Barcode || t("N/A")}</TableCell>
                  <TableCell>{item.name || t("N/A")}</TableCell>
                  <TableCell>{item.CollectionName || t("N/A")}</TableCell>
                  <TableCell>{item.OrderName || t("N/A")}</TableCell>
                  <TableCell>{item.TextileName || t("N/A")}</TableCell>
                  <TableCell>{item.ModelVariant.Color.ColorName || t("N/A")}</TableCell>
                  <TableCell>
                  {item.ModelVariant.Sizes
                    ? item.ModelVariant.Sizes
                        .map((e: any) => e.label)
                        .join(", ")
                    : t("N/A")}
                 </TableCell>

                  <TableCell>{item.ModelVariant.Quantity || t("N/A")}</TableCell>

                  {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                    renderAdminRow(item)
                  ) : (
                    renderUserRow(item)
                  )}
                </TableRow>
              );

            } )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 flex items-center justify-start space-x-2">
          <Button
            onClick={() =>
              setPage((prev) => ({
                ...prev,
                awaitingPage: Math.max(1, page - 1),
              }))
            }
            disabled={page === 1}
          >
            <ChevronLeft />
          </Button>
          <span>{`${t("Page")} ${page} ${t("of")} ${totalPages}`}</span>
          <Button
            onClick={() =>
              setPage((prev) => ({
                ...prev,
                awaitingPage: Math.min(totalPages, page + 1),
              }))
            }
            disabled={page === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-end space-x-2">
         <Select
            value={size.toString()} 
            onValueChange={(value) =>
              setSize((prev) => ({ ...prev, awaitingSize: +value })) 
            }
          >

            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={t("Rows per page")} />
            </SelectTrigger>
            <SelectContent>
            <SelectScrollUpButton />
                {[2, 5, 10, 20, 40, 50, 100].map((s) => (
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
  );
}
