import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
} from "@/services/Suppliers.services.ts";
import { useSetRecoilState } from "recoil";
import {
  newSupplierModal,
  updateSupplierModal,
  supplierId,
  supplier,
} from "@/store/Supplier.ts";
import { SupplierType } from "@/types/Warehouses/Suppliers.type.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import NewSupplier from "@/components/DashboradComponents/Warehouse/Suppliers/NewSupplier.tsx";
import UpdateSupplier from "@/components/DashboradComponents/Warehouse/Suppliers/UpdateSupplier.tsx";

export default function Suppliers() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const setCurrentSupplier = useSetRecoilState(supplier);
  const setNewSupplierModal = useSetRecoilState(newSupplierModal);
  const setUpdateSupplierModal = useSetRecoilState(updateSupplierModal);
  const setSupplierId = useSetRecoilState(supplierId);

  const supplierColumns: ColumnDef<SupplierType>[] = [
    {
      accessorKey: "Name",
      header: t("Name"),
    },
    {
      accessorKey: "Address",
      header: t("Address"),
    },
    {
      accessorKey: "PhoneNumber",
      header: t("PhoneNumber"),
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
                setSupplierId(row.original.Id);
                getSupplierById(setCurrentSupplier, row.original.Id);
                setUpdateSupplierModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteSupplier(setSuppliers, row.original.Id)}
            />
          </div>
        );
      },
    },
  ];

  // Page on load
  useEffect(() => {
    getAllSuppliers(setSuppliers);
  }, []);

  return (
    <div className="w-full space-y-2">
      <NewSupplier getSuppliers={() => getAllSuppliers(setSuppliers)} />
      <UpdateSupplier getSuppliers={() => getAllSuppliers(setSuppliers)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Suppliers")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewSupplierModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("AddSupplier")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={supplierColumns} data={suppliers} tableName="Suppliers"/>
        </div>
      </div>
    </div>
  );
}
