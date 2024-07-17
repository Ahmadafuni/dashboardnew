import  { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { useTranslation } from "react-i18next";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import {
    deleteMaterialMovement,
    getMaterialMovementById, getIncomingMaterialMovements,
} from "@/services/MaterialMovements.services";
import { MaterialMovementType } from "@/types/Warehouses/MaterialMovements.types";
import {
    materialMovementId,
    updateMaterialMovementModal,
    newMaterialMovementModal,
    materialMovementList,
} from "@/store/MaterialMovement";
import { zodResolver } from "@hookform/resolvers/zod";
import { newMaterialMovementSchema } from "@/form_schemas/newMaterialMovementSchema";
import {useParams} from "react-router-dom";
import IncomingMovementForm from "@/components/DashboradComponents/Stores/MaterialMovement/IncomingMovementForm.tsx";

export default function IncomingMovement() {
    const { t } = useTranslation();
    const { materialId } = useParams();
    const [materialMovements, setMaterialMovements] = useRecoilState(materialMovementList);
    const setUpdateMaterialMovementModal = useSetRecoilState(updateMaterialMovementModal);
    const setNewMaterialMovementModal = useSetRecoilState(newMaterialMovementModal);
    const setMaterialMovementId = useSetRecoilState(materialMovementId);

    // Initialize the form
    const form = useForm({
        resolver: zodResolver(newMaterialMovementSchema),
        defaultValues: {
            movementType: "",
            parentMaterialId: 0,
            childMaterialId: 0,
            quantity: 0,
            unitOfQuantity: "",
            description: "",
            movementDate: new Date(),
            warehouseFromId: 0,
            warehouseToId: 0,
            supplierId: 0,
            departmentFromId: 0,
            departmentToId: 0,
            modelId: 0,
        },
    });

    const materialMovementsColumns: ColumnDef<MaterialMovementType>[] = [
        { accessorKey: "MaterialName", header: t("MaterialName") },
        { accessorKey: "MovementType", header: t("MovementType") },
        { accessorKey: "FromLocationId", header: t("FromLocationId") },
        { accessorKey: "ToLocationId", header: t("ToLocationId") },
        { accessorKey: "Quantity", header: t("Quantity") },
        { accessorKey: "UnitOfMeasure", header: t("UnitOfMeasure") },
        { accessorKey: "Date", header: t("Date") },
        { accessorKey: "Description", header: t("Description") },
        {
            header: t("Action"),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            onClick={() => {
                                setMaterialMovementId(row.original.Id);
                                getMaterialMovementById(setMaterialMovements, row.original.Id);
                                setUpdateMaterialMovementModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() =>
                                deleteMaterialMovement(
                                    setMaterialMovements,
                                    row.original.Id,
                                    materialId
                                )
                            }
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getIncomingMaterialMovements(setMaterialMovements);
    }, []);

    const handleIncomingMovementSubmit = (data: any) => {
        // Handle the submission of incoming movement form data
        console.log("Incoming Movement Submitted:", data);
        // You can add logic here to add the new movement to the state and possibly make an API call to save it
        setNewMaterialMovementModal(false); // Close the new material movement modal
    };

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("IncomingMaterialMovements")}</h1>
                <Separator />
            </div>
            <IncomingMovementForm form={form} onSubmit={handleIncomingMovementSubmit} />
            <div className="space-y-2">
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable
                        columns={materialMovementsColumns}
                        data={materialMovements}
                    />
                </div>
            </div>
        </div>
    );
}
