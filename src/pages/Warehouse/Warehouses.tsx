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
  getWarehouseDetails,
} from "@/services/Warehouse.services.ts";
import NewWarehouse from "@/components/DashboradComponents/Warehouse/Warehouses/NewWarehouse.tsx";
import { useSetRecoilState } from "recoil";
import { newWarehouseModal, warehouse } from "@/store/Warehouse.ts";
import UpdateWarehouse from "@/components/DashboradComponents/Warehouse/Warehouses/UpdateWarehouse.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { updateWarehouseModal, warehouseId } from "@/store/Warehouse.ts";
import LoadingDialog from "@/components/ui/LoadingDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const [warehouseDetails, setWarehouseDetails] = useState();
  const [isWarehouseDetailsOpen, setIsWarehouseDetailsOpen] = useState(false);

  const [selectedWarehouse, setSelectedWarehouse] = useState();


  const handleViewMaterials = (warehouseId: any) => {
    // @ts-ignore
    const warehouse = warehouseDetails?.find(w => w.Id === warehouseId);

    console.log(warehouse);
    setSelectedWarehouse(warehouse);
    setIsWarehouseDetailsOpen(true);

  };


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
                        onClick={() => handleViewMaterials(row.original.Id)}

                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>{t("view materials")}</span>
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
    getAllWarehouses(setWarehouses, pages, sizes, setTotalPages, setIsLoading);
  }, [pages, sizes]);


  useEffect(() => {
    getWarehouseDetails(setWarehouseDetails);
  }, []);


  return (
    <div className="w-full space-y-2">

      <Dialog open={isWarehouseDetailsOpen} onOpenChange={setIsWarehouseDetailsOpen}>
        <DialogContent className="sm:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-10 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("WarehouseDetails")}
            </DialogTitle>
          </DialogHeader>

          {selectedWarehouse ? (
            <div className="w-full overflow-x-auto">
              {/* Basic Warehouse Information Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg font-semibold">{t("WarehouseName")}</TableHead>
                    <TableHead className="text-lg font-semibold">{t("Quantity")}</TableHead>
                    <TableHead className="text-lg font-semibold">{t("ItemsCount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-lg">
                      {
                        // @ts-ignore
                        selectedWarehouse.warehouseName}
                    </TableCell>
                    <TableCell className="text-lg">
                      {
                        // @ts-ignore
                        selectedWarehouse?.totalQuantityByUnit ? (
                          <ul className="space-y-1">
                            {
                              // @ts-ignore
                              Object.entries(selectedWarehouse.totalQuantityByUnit).map(([unit, quantity], i) => (
                                <li key={i}>
                                  {Number(quantity)} {unit}
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <span>No Quantities</span>
                        )}
                    </TableCell>
                    <TableCell className="text-lg">
                      Parent Materials: {
                        // @ts-ignore
                        selectedWarehouse.totalParentMaterials}, Child Materials: {selectedWarehouse.totalChildMaterials}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Cards for Parent and Child Materials */}
              <div className="space-y-6 mt-8">
                {
                  // @ts-ignore
                  selectedWarehouse?.parentMaterialsData.map((material, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        {material.parentMaterialName}
                      </h3>
                      <ul className="space-y-2">
                        {
                          // @ts-ignore
                          material.childMaterials.map((childMaterial, i) => (
                            <li key={i} className="pl-6 text-lg text-gray-700 dark:text-gray-300">
                              <span className="font-medium">{childMaterial.childMaterialName}:</span>
                              <span className="ml-4">{childMaterial.quantity} {childMaterial.unit}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-700 dark:text-gray-300">No warehouse selected</p>
          )}

          <DialogFooter className="mt-10 flex justify-end">
            <Button
              onClick={() => setIsWarehouseDetailsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg transition-colors"
            >
              {t("Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {t("WarehouseDetails")}
              </DialogTitle>
            </DialogHeader>
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

                  {
                    // @ts-ignore
                    warehouseDetails?.map((warehouse, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 border-b dark:border-gray-600">
                          {warehouse.warehouseName}
                        </td>
                        <td className="px-6 py-4 border-b dark:border-gray-600">
                          {warehouse?.totalQuantityByUnit ? (
                            <ul>
                              {Object.entries(warehouse.totalQuantityByUnit).map(([unit, quantity], i) => (
                                <li key={i}>
                                  {Number(quantity)} {String(unit)}
                                </li>
                              ))}

                            </ul>
                          ) : (
                            'No Quantities'
                          )
                          }
                        </td>
                        <td className="px-6 py-4 border-b dark:border-gray-600">
                          Parent Materials: {warehouse.totalParentMaterials}, Child Materials: {warehouse.totalChildMaterials}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsDetailsOpen(false)} className="bg-blue-500 text-white dark:bg-gray-700 dark:text-gray-300">
                {t("Close")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>




        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={warehouseColumns} data={warehouses} tableName="Warehouses"
            page={pages}
            setPage={setPages}
            size={sizes}
            setSize={setSizes}
            totalPages={totalPages}
            fieldFilter={{
              "WarehouseName": "WarehouseName",
              "Location": "Location",
              "Capacity": "Capacity",
              "Description": "Description"
            }}
          />
        </div>
      </div>
    </div>
  );
}
