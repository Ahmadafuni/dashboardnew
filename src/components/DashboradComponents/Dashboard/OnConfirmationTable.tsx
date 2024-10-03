import { Button } from "@/components/ui/button";

import { Tracking, WorkType } from "@/types/Dashboard/Dashboard.types";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";
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


  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q, index) => (
        <div key={index}>
          {q.label}: {q.value}
        </div>
      ));
    }
    return quantity;
  };

  const templateColumns: ColumnDef<Tracking>[] = [
    {
      header: t("ModelNumber"),
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
      cell: ({ row }) => {
        return <p>{row.original.ModelVariant.Color.ColorName?
          row.original.ModelVariant.Color.ColorName:t("N/A")
        }</p>;
      },
    },
    {
      header: t("Sizes"),
      cell: ({ row }) => {
        return <p>{
          row.original.ModelVariant.Sizes?
          row.original.ModelVariant.Sizes.map((e: any) => e.label)
          .join(", "):t("N/A")}</p>;
      },
    },
    {
      header:  t("TargetQuantity"),
      cell: ({ row }) => {
        return <p>{row.original.ModelVariant.Quantity?
          row.original.ModelVariant.Quantity:t("N/A")
        }</p>;
      },
    },
    
  ];
  
  if(user?.category === "CUTTING"){
    templateColumns.push(
      {
         header: t("ReceivedQuantity"),
        cell: ({row}) => {
          return  renderQuantity(row.original.QuantityInKg);
        },
      },
      {
         header: t("DeliveredQuantity"),
        cell: ({row}) => {
          return  renderQuantity(row.original.QuantityInNum);
        },
      }
    );

  }else {
    templateColumns.push(
      {
         header: t("ReceivedQuantity"),
        cell: ({row}) => {
          return  renderQuantity(row.original.QuantityReceived);
        },
      },
      {
         header: t("DeliveredQuantity"),
        cell: ({row}) => {
          return  renderQuantity(row.original.QuantityDelivered);
        },
      }
    );

  }
  templateColumns.push(
    {
       header: t("DamageQuantity"),
      cell: ({row}) => {
        return  renderQuantity(row.original.DamagedItem);
      },
    },
  );

  if (userRole === "FACTORYMANAGER" || userRole === "ENGINEERING") {
    templateColumns.push(
        {
            header: t("CurrentStage"),
            cell: ({ row }) => {
                // @ts-ignore
                return <p>{row.original.CurrentStage?.Department?.Name}</p>; 
            },
        },
        {
            header: t("NextStage"),
            cell: ({ row }) => {
              // @ts-ignore
                return <p>{row.original.NextStage?.Department?.Name}</p>;
            },
        },
        {
          header: t("StartTime") ,
          cell: ({row}) => {
            return <p>{row.original.StartTime
              ? format(new Date(row.original.StartTime), "yyyy-MM-dd HH:mm:ss"):t("N/A")}</p>
          },
        },
        {
          header: t("Action") ,
          cell: ({row}) => {
            return  <Button
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
          },
        }
    );
}
else {
  templateColumns.push(
    {
      header: t("Action") ,
          cell: ({row}) => {
            return  <Button
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
          },
    }
    
);

}

  return (
    <div className="space-y-2">
      
      <h2 className="text-2xl font-bold">{t("OnConfirmation")}</h2>
      <div className="overflow-x-auto">
      

      <DataTable 
        columns={templateColumns} 
        data={works.givingConfirmation}
        tableName="TrakingModels"
        isDashboard={true}
        fieldFilter={{
          "ModelNumber" : "ModelNumber"
        }}
        stage="3"
      />
      



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
