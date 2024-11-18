
import { Tracking, WorkType } from "@/types/Dashboard/Dashboard.types";
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
import {  ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction , useState } from "react";
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
}

export default function CompletedTable({
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

 

 
  // @ts-ignore
  const [pageSize, setPageSize] = useState(10);

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.label}: ${q.value}`).join(", ");
    }
    return quantity;
  };
  
  const calculateDuration = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    const hours = differenceInHours(end, start) % 24;
    return `${days}d ${hours}h`;
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
      header: t("TargetQuantity"),
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
        header: t("Duration"),
        accessorFn: (row) =>
          (row.StartTime && row.EndTime) || t("N/A"),

        cell: ({ row }) => {
          if (row.original.StartTime && row.original.EndTime)
            return calculateDuration(
              new Date(row.original.StartTime),
              new Date(row.original.EndTime)
            );
          else t("NA");
        },
      },
      {
        header: t("Action"),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
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
            </div>
          );
        },
      }
    );
}
else {

  if(user?.category === "CUTTING"){
    templateColumns.push(
      {
        header: t("ReceivedQuantity"),
        accessorFn: (row) => row.QuantityInKg || t("N/A"),

        cell: ({ row }) => {
          return renderQuantity(row.original.QuantityInKg);
        },
      },
      {
        header: t("DeliveredQuantity"),
        accessorFn: (row) => row.QuantityInNum || t("N/A"),

        cell: ({ row }) => {
          return renderQuantity(row.original.QuantityInNum);
        },
      }
    );

  }else {
    templateColumns.push(
      {
        header: t("ReceivedQuantity"),
        accessorFn: (row) => row.QuantityReceived || t("N/A"),

        cell: ({ row }) => {
          return renderQuantity(row.original.QuantityReceived);
        },
      },
      {
        header: t("DeliveredQuantity"),
        accessorFn: (row) => row.QuantityDelivered || t("N/A"),
        cell: ({ row }) => {
          return renderQuantity(row.original.QuantityDelivered);
        },
      }
    );

  }

  templateColumns.push(
    {
      header: t("DamageQuantity"),
      accessorFn: (row) => row.DamagedItem || t("N/A"),

      cell: ({ row }) => {
        return renderQuantity(row.original.DamagedItem);
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


}


  return (
    <div className="space-y-2">
      
      <h2 className="text-2xl font-bold">{t("Completed")}</h2>
      <div className="overflow-x-auto">
       

      <DataTable 
        columns={templateColumns} 
        data={works.completed}
        tableName="TrakingModels"
        isDashboard={true}
        fieldFilter={{
          "ModelNumber" : "ModelNumber"
        }}
        stage="4"
      />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (page > 1) {
                  setPage((prev) => ({
                    ...prev,
                    completedPage: prev.completedPage - 1,
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
                    completedPage: prev.completedPage + 1,
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
                setSize((prev) => ({ ...prev, completedSize: Number(value) }))
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
