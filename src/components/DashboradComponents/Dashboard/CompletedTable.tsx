import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
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

  const [summaryData, setSummaryData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

  const closeModal = () => {
    setIsModalOpen(false);
    setSummaryData(null);
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
          header: t("Duration") ,
          cell: ({row}) => {
            
            if(row.original.StartTime && row.original.EndTime)
            return calculateDuration(new Date(row.original.StartTime), new Date(row.original.EndTime));
          else t("NA") ;

          },
        },
        {
          header: t("Action") ,
          cell: ({row}) => {
            return  <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(`/models/viewdetails/${row.original.ModelVariant.Model.Id}`, "_blank")
                }
              >
                {t("Details")}
              </Button>

              <Button
                variant="secondary"
                onClick={() => fetchSummary(row.original.ModelVariant.Id)}
              >
                {t("Summary")}
              </Button>
            </div>
          },
        }
    );
}
else {

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
      
      <h2 className="text-2xl font-bold">{t("Completed")}</h2>
      <div className="overflow-x-auto">
       

      <DataTable 
        columns={templateColumns} 
        data={works.completed}
        tableName="TrakingModels"
        isDashboard={true}
      />


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
