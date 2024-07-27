import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import {
    deleteMaterialMovement,
    getMaterialMovementsByMovementType,
} from "@/services/MaterialMovements.services";
import { materialMovementList } from "@/store/MaterialMovement";
import NewMovement from "@/components/DashboradComponents/Warehouse/MaterialMovement/NewMovement.tsx";

export default function IncomingMovement() {
    const { t } = useTranslation();

    const [materialMovements, setMaterialMovements] = useRecoilState(materialMovementList);

    const movementFromOptions = [
        { label: t("Department"), value: "Department" },
        { label: t("Warehouse"), value: "Warehouse" },
        { label: t("Supplier"), value: "Supplier" },
    ];
    const movementToOptions = [{ label: t("Warehouse"), value: "Warehouse" }];

    const materialMovementsColumns: ColumnDef<any>[] = [
        { accessorKey: "invoiceNumber", header: t("InvoiceNumber") },
        { accessorKey: "parentMaterialName", header: t("ParentMaterialName") },
        { accessorKey: "childMaterialName", header: t("ChildMaterialName") },
        { accessorKey: "movedFrom", header: t("MovedFrom") },
        { accessorKey: "movedTo", header: t("MovedTo") },
        { accessorKey: "quantity", header: t("Quantity") },
        { accessorKey: "unitOfQuantity", header: t("UnitOfQuantity") },
        {
            accessorKey: "movementDate",
            header: t("Date"),
            cell: ({ row }) => {
                const date = new Date(row.original.movementDate);
                return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
            },
        },
        { accessorKey: "modelName", header: t("ModelName") },
        { accessorKey: "description", header: t("Description") },
        {
            header: t("Action"),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <DeleteConfirmationDialog
                            deleteRow={() =>
                                deleteMaterialMovement(
                                    setMaterialMovements,
                                    row.original.id,
                                    "INCOMING"
                                )
                            }
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getMaterialMovementsByMovementType(setMaterialMovements, "INCOMING");
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [setMaterialMovements]);

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("IncomingMaterialMovements")}</h1>
                <Separator />
            </div>
            <NewMovement movementFromOptions={movementFromOptions} movementToOptions={movementToOptions} movementType="INCOMING" />
            <div className="space-y-2">
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable
                        columns={materialMovementsColumns}
                        data={materialMovements ?? []}
                    />
                </div>
            </div>
        </div>
    );
}
