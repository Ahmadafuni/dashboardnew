import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  holdOrder,
  startOrder,
} from "@/services/Order.services.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Download, EllipsisVertical, Eye, Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  newOrderModal,
  order,
  orderId,
  updateOrderModal,
} from "@/store/Orders.ts";
import { OrderType } from "@/types/Orders/Orders.types.ts";
import NewOrder from "@/components/DashboradComponents/Orders/NewOrder.tsx";
import UpdateOrder from "@/components/DashboradComponents/Orders/UpdateOrder.tsx";
import { downLoadFile } from "@/services/Commons.services";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog";

export default function Orders() {
  const setNewOrderModal = useSetRecoilState(newOrderModal);
  const setUpdateOrderModal = useSetRecoilState(updateOrderModal);
  const setOrderId = useSetRecoilState(orderId);
  const setOrder = useSetRecoilState(order);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const { t } = useTranslation();

  // Navigate
  const navigate = useNavigate();

  const orderColumns: ColumnDef<OrderType>[] = [
    {
      accessorKey: "OrderNumber",
      header: t("Order Number"),
    },
    {
      accessorKey: "OrderName",
      header: t("Order Name"),
    },
    {
      header: "Collection",
      cell: ({ row }) => {
        return <p>{row.original.Collection.CollectionName}</p>;
      },
    },
    {
      accessorKey: "Quantity",
      header: t("Quantity"),
    },
    {
      header: "DeadlineDate",
      cell: ({ row }) => {
        // @ts-expect-error
        return <p>{row.original.DeadlineDate.split("T")[0]}</p>;
      },
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="space-x-1">
            {row.original.Status === "PENDING" ? (
              <BasicConfirmationDialog
                btnText={"Start Order"}
                takeAction={() => startOrder(setOrders, row.original.Id)}
                className="bg-green-500 hover:bg-green-600"
              />
            ) : (
              <BasicConfirmationDialog
                btnText={"Hold Order"}
                takeAction={() => holdOrder(setOrders, row.original.Id)}
                className="bg-orange-500 hover:bg-orange-600"
              />
            )}
          </div>
        );
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <DeleteConfirmationDialog
              deleteRow={() => deleteOrder(setOrders, row.original.Id)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setOrderId(row.original.Id);
                      getOrderById(setOrder, row.original.Id);
                      setUpdateOrderModal(true);
                    }}
                  >
                    <Pen className="mr-2 h-4 w-4" />
                    <span>Edit Order</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/dashboard/orders/model/${row.original.Id}`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Model</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/dashboard/orders/model/new/${row.original.Id}`)
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Model</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={row.original.FilePath.length <= 0 ? true : false}
                    onClick={() =>
                      downLoadFile(
                        "https://dashboardbackendnew.onrender.com" +
                          row.original.FilePath
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllOrders(setOrders);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewOrder getAllOrders={() => getAllOrders(setOrders)} />
      <UpdateOrder getAllOrders={() => getAllOrders(setOrders)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Orders")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewOrderModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={orderColumns} data={orders} />
        </div>
      </div>
    </div>
  );
}
