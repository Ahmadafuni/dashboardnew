import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { userInfo } from "@/store/authentication";
import {
  completeModal,
  currentTrackingId,
  currentVariantId,
  cuttingSendConfirmationModal,
  othersSendConfirmationModal,
} from "@/store/dashboard";
import { Tracking, WorkType } from "@/types/Dashboard/Dashboard.types";
import { format } from "date-fns";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog.tsx";
import {
  holdModelVarinte,
  restartModelVarinte,
} from "@/services/ModelVarients.services.ts";
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
  setWorks: (data: any) => void;
  setSelectedSizes: Dispatch<SetStateAction<{ label: string; value: string; }[]>>;
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


  const renderQuantity = (quantity: any) => {
    console.log("quantity : ", quantity);

    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.label}: ${q.value}`).join(", ");
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
    await getAllWork(user?.userDepartmentId,{}, {}, setWorks);
  };


  const handleSendConfirmation = (item: any, type: string) => {
    console.log("item" , item);
    console.log("Sizes for confirmation are : ", item.ModelVariant.Sizes);
    const sizes = item.ModelVariant.Sizes ;
    const quantityReceived = item.QuantityReceived || [];
    // @ts-ignore
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
    const sizes = item.ModelVariant.Sizes;
    console.log("size" , sizes);
        // @ts-ignore
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
    {
      accessorKey: "QuantityReceived",
      header: t("ReceivedQuantity"),
      cell: ({row}) => {
        return  renderQuantity(row.original.QuantityReceived);
      },
    },
    
  ];

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
else { // user
  templateColumns.push(
    {
      header: t("StartTime") ,
          cell: ({row}) => {
            return <p>{row.original.StartTime
              ? format(new Date(row.original.StartTime), "yyyy-MM-dd HH:mm:ss"):t("N/A")}</p>
          },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex space-x-1">
                  {item.ModelVariant.RunningStatus === "ONGOING" ? (
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
                <Button onClick={() => {
                    
                  return handleSendCuttingConfirmation(item) ;
                }}>
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
          </div>
        );
      },
    }
    
);


}

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{t("Ongoing")}</h2>
      <div className="overflow-x-auto">
       
      <DataTable 
      columns={templateColumns} 
      data={works.inProgress}
      tableName="TrakingModels"
      isDashboard={true}
      />


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
