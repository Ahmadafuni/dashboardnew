import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tracking, WorkType } from "@/types/Dashboard/Dashboard.types";
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
import { ChevronLeft, ChevronRight, EllipsisVertical, Eye } from "lucide-react";
import { Dispatch, SetStateAction, useEffect , useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const { t } = useTranslation();

  const [summaryData, setSummaryData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  
  // @ts-ignore
  const [pageSize, setPageSize] = useState(10);

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.label}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  useEffect(() => {

  }, [works]);

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
      header:  t("ReceivedQuantity"),
      cell: ({ row }) => {
        return <p>{row.original.QuantityReceived?
          row.original.QuantityReceived:t("N/A")
        }</p>;
      },
    },
    {
      header:  t("DeliveredQuantity"),
      cell: ({ row }) => {
        return <p>{row.original.QuantityDelivered?
          row.original.QuantityDelivered:t("N/A")
        }</p>;
      },
    },
    {
      header:  t("Duration"),
      cell: ({ row }) => {
        // @ts-ignore
        return <p>{row.original.duration?row.original.duration:t("N/A")
        }</p>;
      },
    },

    {
      header: t("Action") ,
      cell: ({row}) => {
        return  <div className="flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <EllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>  window.open(
                  `/models/viewdetails/${row.original.ModelVariant.Model.Id}`,
                  "_blank"
                )
                
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>{t("Details")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>  window.open(
                  `/models/viewsummary/${row.original.ModelVariant.Model.Id}`,
                  "_blank"
                )
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>{t("Summary")}</span>
              </DropdownMenuItem>
                    
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      },
    }
  ];
  
  
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{t("Finished")}</h2>
      <div className="overflow-x-auto">
      
      <DataTable 
        columns={templateColumns} 
        data={works.finished}
        tableName="TrakingModels"
        isDashboard={true}
        fieldFilter={{
          "ModelNumber" : "ModelNumber"
        }}
        stage="5"
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
          </div>
        </div>
      </div>
    </div>
  );
}
