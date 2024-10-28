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
  getWarehouseDetails, // Import this function to fetch warehouse details
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
import LoadingDialog from "@/components/ui/LoadingDialog";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Suppliers() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [warehouseDetails, setWarehouseDetails] = useState<any[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const setCurrentSupplier = useSetRecoilState(supplier);
  const setNewSupplierModal = useSetRecoilState(newSupplierModal);
  const setUpdateSupplierModal = useSetRecoilState(updateSupplierModal);
  const setSupplierId = useSetRecoilState(supplierId);
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

            <Button
              onClick={() => {
                getWarehouseDetails(setWarehouseDetails, Number(row.original.Id));
                setIsDetailsOpen(true);
              }}
            >
              {t("Details")}
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllSuppliers(setSuppliers, pages, sizes, setTotalPages, setIsLoading);
  }, [pages, sizes]);

  

  return (
    <div className="w-full space-y-2">
      {isLoading && (
        <LoadingDialog
          isOpen={isLoading}
          message="Loading..."
          subMessage="Please wait, your request is being processed now."
        />
      )}
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
          <DataTable
            columns={supplierColumns}
            data={suppliers}
            tableName="Suppliers"
            page={pages}
            setPage={setPages}
            size={sizes}
            setSize={setSizes}
            totalPages={totalPages}
            fieldFilter={{
              Name: "Name",
              Address: "Address",
              PhoneNumber: "PhoneNumber",
              Description: "Description",
            }}
          />
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
    <DialogContent className="sm:max-w-[800px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t("WarehouseDetails")}
            </DialogTitle>
        </DialogHeader>

        <div className="w-full overflow-x-auto">
            <Table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden">
                <TableHeader>
                    <TableRow className="bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <TableHead className="px-6 py-4 border-b dark:border-gray-600 text-left text-sm font-semibold">
                            {t("MaterialName")}
                        </TableHead>
                        <TableHead className="px-6 py-4 border-b dark:border-gray-600 text-left text-sm font-semibold">
                            {t("Category")}
                        </TableHead>
                        <TableHead className="px-6 py-4 border-b dark:border-gray-600 text-left text-sm font-semibold">
                            {t("Quantities")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouseDetails.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="px-6 py-4 border-b dark:border-gray-600">
                                {item.materialName}
                            </TableCell>
                            <TableCell className="px-6 py-4 border-b dark:border-gray-600">
                                {item.category}
                            </TableCell>
                            <TableCell className="px-6 py-4 border-b dark:border-gray-600">
                                {
                                // @ts-ignore
                                item.quantities.map((q, i) => (
                                    <div key={i} style={{ direction: "rtl", textAlign: "right" }}>
                                      <span>{q.incomingQuantity} {q.unit} ({t("Incoming")})</span> -&nbsp;
                                      <span>{q.outgoingQuantity} {q.unit} ({t("Outgoing")})</span> -&nbsp;
                                      <span>{q.netQuantity} {q.unit} ({t("existing")})</span>
                                    </div>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <DialogFooter className="mt-4 flex justify-end">
            <Button
                onClick={() => setIsDetailsOpen(false)}
                className="bg-blue-500 text-white dark:bg-gray-700 dark:text-gray-300"
            >
                {t("Close")}
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>

    </div>
  );
}
