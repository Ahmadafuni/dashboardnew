import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
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

export default function OnConfirmationTable({
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

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const sortedWorks = [...works.givingConfirmation].sort((a, b) => {
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
      return quantity.map((q, index) => (
        <div key={index}>
          {q.size}: {q.value}
        </div>
      ));
    }
    return quantity;
  };

  const renderAdminRow = (item: any) => (
    <>
      <TableCell>{item.CurrentStage?.Department?.Name || t("NA")}</TableCell>
      <TableCell>{item.NextStage?.Department?.Name || t("NA")}</TableCell>
      <TableCell>
        {item.StartTime
          ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss")
          : t("NA")}
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

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("OnConfirmation")}</h2>
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
              <TableHead onClick={() => requestSort("DeliveredQuantity")}>
                {t("DeliveredQuantity")}
                {sortConfig?.key === "DeliveredQuantity" && (
                  sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown />
                )}
              </TableHead>
              <TableHead onClick={() => requestSort("DamageQuantity")}>
                {t("DamageQuantity")}
                {sortConfig?.key === "DamageQuantity" && (
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
            {sortedWorks?.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                      ? 11
                      : 8
                  }
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
            {sortedWorks.map((item) => {
              const isPaused = item.ModelVariant.RunningStatus === "PAUSED";
              return (
                <TableRow
                  key={item.Id}
                  style={isPaused ? { backgroundColor: "orange" } : {}}
                >
                  <TableCell className="font-medium">
                    {item.ModelVariant.Model.DemoModelNumber}
                  </TableCell>
                  <TableCell className="font-medium">{item.Barcode}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-medium">
                    {item.CollectionName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.OrderName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.TextileName}
                  </TableCell>

                  <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                  <TableCell>
                  {item.ModelVariant.Sizes
                    ? item.ModelVariant.Sizes
                        .map((e: any) => e.label)
                        .join(", ")
                    : t("N/A")}
                 </TableCell>
                  <TableCell>{item.ModelVariant.Quantity}</TableCell>
                  {user?.category === "CUTTING" ? (
                    <>
                      <TableCell>
                        {renderQuantity(item.QuantityInKg)} Kg
                      </TableCell>
                      <TableCell>
                        {renderQuantity(item.QuantityInNum)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        {renderQuantity(item.QuantityReceived)}
                      </TableCell>
                      <TableCell>
                        {renderQuantity(item.QuantityDelivered)}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>
                  {userRole === "FACTORYMANAGER" ||
                  userRole === "ENGINEERING" ? (
                    renderAdminRow(item)
                  ) : (
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
                  )}
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
                    givingConfirmationPage: prev.givingConfirmationPage - 1,
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
                    givingConfirmationPage: prev.givingConfirmationPage + 1,
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
                setSize((prev) => ({
                  ...prev,
                  givingConfirmationSize: Number(value),
                }))
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
