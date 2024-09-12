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
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

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

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  const renderAdminRow = (item: any) => (
    <>
      <TableCell>{item.PrevStage?.Department?.Name || t("N/A")}</TableCell>
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
              <TableHead>{t("ModelNumber")}</TableHead>
              <TableHead>{t("Barcode")}</TableHead>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Collections")}</TableHead>
              <TableHead>{t("OrderNumber")}</TableHead>
              <TableHead>{t("Textile")}</TableHead>
              <TableHead>{t("Color")}</TableHead>
              <TableHead>{t("Size")}</TableHead>
              <TableHead>{t("TargetQuantity")}</TableHead>
              <TableHead>{t("ReceivedQuantity")}</TableHead>
              {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                <>
                  <TableHead>{t("PrevStage")}</TableHead>
                  <TableHead>{t("CurrentStage")}</TableHead>
                  <TableHead>{t("NextStage")}</TableHead>
                  <TableHead>{t("StartTime")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                </>
              ) : (
                <TableHead>{t("Action")}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {works?.awaiting?.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={user?.category !== "CUTTING" ? 6 : 5}
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
            {works?.awaiting?.length > 0 &&
              works?.awaiting.map((item) => {
                const isPaused = item.ModelVariant.RunningStatus === "PAUSED";

                console.log("items", item);

                return (
                  <TableRow
                    key={item.Id}
                    style={isPaused ? { backgroundColor: "orange" } : {}}
                  >
                    <TableCell className="font-medium">
                      {item.ModelVariant.Model.DemoModelNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.Barcode}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">
                      {item.CollectionName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.OrderNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.TextileName}
                    </TableCell>
                    <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                    <TableCell>
                      {JSON.parse(item.ModelVariant.Sizes)
                        //.map((e: any) => e.label)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{item.ModelVariant.Quantity}</TableCell>
                    {item?.QuantityInKg != null ? (
                      <TableCell>
                        {renderQuantity(item.QuantityInNum)}
                      </TableCell>
                    ) : (
                      <TableCell>
                        {renderQuantity(
                          item.MainStatus === "CHECKING"
                            ? item.QuantityDelivered
                            : item.QuantityReceived
                        )}
                      </TableCell>
                    )}
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
                    awaitingPage: prev.awaitingPage - 1,
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
                    awaitingPage: prev.awaitingPage + 1,
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
                setSize((prev) => ({ ...prev, awaitingSize: Number(value) }))
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
