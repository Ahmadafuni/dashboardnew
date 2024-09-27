import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WarehouseType } from "@/types/Warehouses/Warehouses.types.ts";
import {
  deleteWarehouse,
  getAllWarehouses,
  getWarehouseById,
} from "@/services/Warehouse.services.ts";
import NewWarehouse from "@/components/DashboradComponents/Warehouse/Warehouses/NewWarehouse.tsx";
import { useSetRecoilState } from "recoil";
import { newWarehouseModal, warehouse } from "@/store/Warehouse.ts";
import UpdateWarehouse from "@/components/DashboradComponents/Warehouse/Warehouses/UpdateWarehouse.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { updateWarehouseModal, warehouseId } from "@/store/Warehouse.ts";

export default function Warehouses() {
  const { t } = useTranslation();

  const setWarehouse = useSetRecoilState(warehouse);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const setNewWareHouseModal = useSetRecoilState(newWarehouseModal);
  const setUpdateWareHouseModal = useSetRecoilState(updateWarehouseModal);
  const setWareHouseId = useSetRecoilState(warehouseId);

  const warehouseColumns: ColumnDef<WarehouseType>[] = [
    {
      accessorKey: "WarehouseName",
      header: t("WarehouseName"),
    },
    {
      accessorKey: "CategoryName",
      header: t("CategoryName"),
    },
    {
      accessorKey: "Location",
      header: t("Location"),
    },
    {
      accessorKey: "Capacity",
      header: t("Capacity"),
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
                setWareHouseId(row.original.Id);
                getWarehouseById(setWarehouse, row.original.Id);
                setUpdateWareHouseModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteWarehouse(setWarehouses, row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllWarehouses(setWarehouses);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewWarehouse getWarehouse={() => getAllWarehouses(setWarehouses)} />
      <UpdateWarehouse getWarehouse={() => getAllWarehouses(setWarehouses)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Warehouses")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewWareHouseModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("AddWarehouse")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={warehouseColumns} data={warehouses} tableName="Warehouses" />
        </div>
      </div>
    </div>
  );
}
