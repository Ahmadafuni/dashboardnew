import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pen, Plus } from "lucide-react";
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
import LoadingDialog from "@/components/ui/LoadingDialog";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Warehouses() {
  const { t } = useTranslation();

  const setWarehouse = useSetRecoilState(warehouse);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const setNewWareHouseModal = useSetRecoilState(newWarehouseModal);
  const setUpdateWareHouseModal = useSetRecoilState(updateWarehouseModal);
  const setWareHouseId = useSetRecoilState(warehouseId);
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);



  const openDetailsModal = () => {
    setIsDetailsOpen(true);
  };


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
          <>

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

<div className="flex gap-1">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuGroup>

                  <DropdownMenuItem
                    onClick={() => console.log("details")

                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>{t("view details")}</span>
                  </DropdownMenuItem>
                 
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          </div>
          </>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllWarehouses(setWarehouses , pages , sizes , setTotalPages , setIsLoading);
  }, [pages , sizes]);
  return (
    <div className="w-full space-y-2">
      {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />} 
          
      <NewWarehouse getWarehouse={() => getAllWarehouses(setWarehouses)} />
      <UpdateWarehouse getWarehouse={() => getAllWarehouses(setWarehouses)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Warehouses")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => {
              setNewWareHouseModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("AddWarehouse")}
          </Button>

          <Button
            onClick={() => openDetailsModal()}
          >
            {t("Details")}
          </Button>

        </div>

        <Dialog.Root open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
  <Dialog.Overlay className="fixed inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 opacity-40 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 dark:opacity-70 z-50" />
  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-t-4 border-blue-500 dark:border-gray-500 animate-fade-in z-50">
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      {t("WarehouseDetails")}
    </h2>

    <div className="w-full overflow-x-auto">
      <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <th className="px-6 py-4 border-b dark:border-gray-600 text-left text-sm font-semibold">
              {t("WarehouseName")}
            </th>
            <th className="px-6 py-4 border-b dark:border-gray-600 text-left text-sm font-semibold">
              {t("Quantity")}
            </th>
            <th className="px-6 py-4 border-b dark:border-gray-600 text-left text-sm font-semibold">
              {t("ItemsCount")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-300">
              المواد الخام
            </td>
            <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-300">
              120
            </td>
            <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-300">
              20
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="mt-4 flex justify-end">
      <Button onClick={() => setIsDetailsOpen(false)} className="bg-blue-500 text-white dark:bg-gray-700 dark:text-gray-300">
        {t("Close")}
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>



        
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={warehouseColumns} data={warehouses} tableName="Warehouses" 
          page={pages}
          setPage={setPages}
          size={sizes}
          setSize={setSizes}
          totalPages={totalPages}
         fieldFilter={{
            "WarehouseName" : "WarehouseName" , 
            "Location" : "Location" ,
            "Capacity" : "Capacity", 
            "Description" : "Description"
          }}
          />
        </div>
      </div>
    </div>
  );
}
