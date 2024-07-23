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

    const materialMovementsColumns: ColumnDef<any>[] = [
        { accessorKey: "invoiceNumber", header: t("Invoice Number") },
        { accessorKey: "parentMaterialName", header: t("Parent Material Name") },
        { accessorKey: "childMaterialName", header: t("Child Material Name") },
        { accessorKey: "movedFrom", header: t("Moved From") },
        { accessorKey: "movedTo", header: t("Moved To") },
        { accessorKey: "quantity", header: t("Quantity") },
        { accessorKey: "unitOfQuantity", header: t("Unit Of Quantity") },
        {
            accessorKey: "movementDate",
            header: t("Date"),
            cell: ({ row }) => {
                const date = new Date(row.original.movementDate);
                return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
            },
        },
        { accessorKey: "modelName", header: t("Model Name") },
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
                // @ts-ignore
                const { data } = await getMaterialMovementsByMovementType(setMaterialMovements,"INCOMING");
                if (Array.isArray(data)) {
                    // @ts-ignore
                    setMaterialMovements(data);
                } else {
                    console.error("Expected an array but got:", data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [setMaterialMovements]);

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("Incoming Material Movements")}</h1>
                <Separator />
            </div>
            <NewMovement />
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
