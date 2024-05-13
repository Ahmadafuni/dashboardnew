import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteMaterialMovement,
  getAllMaterialMovements,
  getMaterialMovementById,
} from "@/services/MaterialMovements.services";
import { MaterialMovementType } from "@/types/Warehouses/MaterialMovements.types.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { useSetRecoilState } from "recoil";
import {
  materialMovementId,
  updateMaterialMovementModal,
} from "@/store/MaterialMovement.ts";
import { useParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton";

export default function MaterialMovement() {
  const { t } = useTranslation();
  const { materialId } = useParams();
  const [materialMovements, setMaterialMovements] = useState([]);
  const setUpdateMaterialMovementModal = useSetRecoilState(
    updateMaterialMovementModal
  );
  const setMaterialMovementId = useSetRecoilState(materialMovementId);

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
    getAllMaterialMovements(setMaterialMovements, materialId);
  }, []);

  return (
    <div className="w-full space-y-2">
      <BackButton />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("MaterialMovements")}</h1>
        <Separator />
      </div>
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
