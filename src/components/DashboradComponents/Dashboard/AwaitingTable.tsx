import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  confirmVariant,
  rejectVariant,
  startVariant,
} from "@/services/Dashboard.services";
import { Tracking, WorkType } from "@/types/Dashboard/Dashboard.types";
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
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/DataTable";

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
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
}

export default function AwaitingTable({
  page,
  setPage,
  size,
  setSize,
  totalPages,
  works,
  setWorks,
  setIsLoading
}: Props) {
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;
  const { t } = useTranslation();

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.label}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  const templateColumns: ColumnDef<Tracking>[] = [
    {
      header: t("ModelNumber"),
      accessorFn: (row) => row.ModelVariant.Model.DemoModelNumber || t("N/A"),
      cell: ({ row }) => {
        return <p>{row.original.ModelVariant.Model.DemoModelNumber}</p>;
      },
    },
    {
      accessorKey: "Barcode",
      header: t("Barcode"),
    },
    {
      accessorKey: "name",
      header: t("Name"),
    },

    {
      accessorKey: "CollectionName",
      header: t("Collections"),
    },
    {
      accessorKey: "OrderName",
      header: t("OrderNumber"),
    },
    {
      accessorKey: "TextileName",
      header: t("Textile"),
    },
    {
      header: t("Color"),
      accessorFn: (row) => row.ModelVariant.Color.ColorName || t("N/A"),
      cell: ({ row }) => {
        return (
          <p>
            {row.original.ModelVariant.Color.ColorName
              ? row.original.ModelVariant.Color.ColorName
              : t("N/A")}
          </p>
        );
      },
    },
    {
      header: t("Sizes"),
      accessorFn: (row) => row.ModelVariant.Sizes || t("N/A"),

      cell: ({ row }) => {
        return (
          <p>
            {row.original.ModelVariant.Sizes
              ? row.original.ModelVariant.Sizes.map((e: any) => e.label).join(
                  ", "
                )
              : t("N/A")}
          </p>
        );
      },
    },
    {
      header: t("Quantity"),
      accessorFn: (row) => row.ModelVariant.Quantity || t("N/A"),

      cell: ({ row }) => {
        return (
          <p>
            {row.original.ModelVariant.Quantity
              ? row.original.ModelVariant.Quantity
              : t("N/A")}
          </p>
        );
      },
    },
  ];

  if (userRole === "FACTORYMANAGER" || userRole === "ENGINEERING") {
    templateColumns.push(
      {
        header: t("CurrentStage"),
        // @ts-ignore
        accessorFn: (row) => row.CurrentStage?.Department?.Name || t("N/A"),
        cell: ({ row }) => {
          // @ts-ignore
          return <p>{row.original.CurrentStage?.Department?.Name}</p>;
        },
      },
      {
        header: t("NextStage"),
        // @ts-ignore
        accessorFn: (row) => row.NextStage?.Department?.Name || t("N/A"),
        cell: ({ row }) => {
          // @ts-ignore
          return <p>{row.original.NextStage?.Department?.Name}</p>;
        },
      },
      {
        header: t("StartTime"),
        accessorFn: (row) => row.StartTime || t("N/A"),
        cell: ({ row }) => {
          return (
            <p>
              {row.original.StartTime
                ? format(
                    new Date(row.original.StartTime),
                    "yyyy-MM-dd HH:mm:ss"
                  )
                : t("N/A")}
            </p>
          );
        },
      },
      {
        header: t("Action"),
        cell: ({ row }) => {
          return (
            <Button
              variant="secondary"
              onClick={() =>
                window.open(
                  `/models/viewdetails/${row.original.ModelVariant.Model.Id}`,
                  "_blank"
                )
              }
            >
              {t("Details")}
            </Button>
          );
        },
      }
    );
  } else {
    templateColumns.push({
      header: t("Action"),
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex space-x-1">
            {item.MainStatus === "TODO" ? (
              <BasicConfirmationDialog
                btnText={t("Start")}
                takeAction={() =>
                  startVariant(setWorks, item.ModelVariant.Id, setIsLoading)
                }
                className=""
              />
            ) : (
              <ConfirmRejectAlertDialog
                acceptVariant={() =>
                  confirmVariant(setWorks, item.Id, setIsLoading)
                }
                rejectVariant={() =>
                  rejectVariant(setWorks, item.Id, setIsLoading)
                }
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
          </div>
        );
      },
    });
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{t("Awaiting")}</h2>
      <div className="overflow-x-auto">
        <DataTable
          columns={templateColumns}
          data={works.awaiting}
          tableName="TrakingModels"
          isDashboard={true}
          fieldFilter={{
            ModelNumber: "ModelNumber",
          }}
          stage="1"
        />
      </div>

      {/* pagination */}
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
              {[2, 5, 10, 20, 40, 50, 100, 200].map((s) => (
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
