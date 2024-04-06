import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { deleteOrder, getAllOrders, getOrderById } from "@/services/Order.services.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {newOrderModal, order, orderId, updateOrderModal} from "@/store/Orders.ts";
import {OrderType} from "@/types/Orders/Orders.types.ts";
import NewOrder from "@/components/DashboradComponents/Orders/NewOrder.tsx";
import UpdateOrder from "@/components/DashboradComponents/Orders/UpdateOrder.tsx";

export default function Orders() {
    const setNewOrderModal = useSetRecoilState(newOrderModal);
    const setUpdateOrderModal = useSetRecoilState(updateOrderModal);
    const setOrderId = useSetRecoilState(orderId);
    const setOrder = useSetRecoilState(order);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const { t } = useTranslation();

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
            accessorKey: "CollectionID",
            header: t("Collection"),
        },
        {
            accessorKey: "Quantity",
            header: t("Quantity"),
        },
        {
            accessorKey: "DeadlineDate",
            header: t("Deadline Date"),
        },
        {
            accessorKey: "Description",
            header: t("Description"),
        },
        {
            header: t("Action"),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            onClick={() => {
                                setOrderId(row.original.Id);
                                getOrderById(setOrder, row.original.Id);
                                setUpdateOrderModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteOrder(setOrders, row.original.Id)}
                        />
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
                    <DataTable
                        columns={orderColumns}
                        data={orders}
                    />
                </div>
            </div>
        </div>
    );
}
