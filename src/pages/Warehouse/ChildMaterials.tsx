import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import UpdateChildMaterial from "@/components/DashboradComponents/Warehouse/ChildMaterials/UpdateChildMaterial";
import NewChildMaterial from "@/components/DashboradComponents/Warehouse/ChildMaterials/NewChildMaterial";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import {
    deleteChildMaterial,
    getChildMaterialById,
    getChildMaterialByParentId,
} from "@/services/Materials.services";
import { ChildMaterialType } from "@/types/Warehouses/Materials.types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useSetRecoilState } from "recoil";
import {
    childMaterial,
    childMaterialId,
    newChildMaterialModal,
    updateChildMaterialModal
} from "@/store/ChildMaterial";
import BackButton from "@/components/common/BackButton.tsx";

export default function ChildMaterials() {
    const { materialID } = useParams();
    const { t } = useTranslation();
    const setNewChildMaterialModal = useSetRecoilState(newChildMaterialModal);
    const setUpdateChildMaterialModal = useSetRecoilState(updateChildMaterialModal);
    const setChildMaterialId = useSetRecoilState(childMaterialId);
    const setChildMaterial = useSetRecoilState(childMaterial);

    const location = useLocation();
     const { materialName } = location.state || {};
  

    const [childmaterials, setChildmaterials] = useState<ChildMaterialType[]>([]);
    const materialColumns: ColumnDef<ChildMaterialType>[] = [
        { accessorKey: "Name", header: t("Name") },
        { accessorKey: "DyeNumber", header: t("DyeNumber") },
        { accessorKey: "Halil", header: t("Halil") },
        { accessorKey: "Kashan", header: t("Kashan") },
        { accessorKey: "Phthalate", header: t("Phthalate") },
        { accessorKey: "GramWeight", header: t("GramWeight") },
        { accessorKey: "Description", header: t("Description") },
        { accessorKey: "Quantities", header: t("Quantity available"),
            // @ts-ignore
            cell: ({ row }) => row.original.Quantities ? row.original.Quantities?.map((e)=> e.unit + " : " + e.quantity).join(" , ") : "",
         },
         { accessorKey: "WarehouseQuantities", header: t("Quantity details"),
            // @ts-ignore
            cell: ({ row }) => row.original.WarehouseQuantities ? row.original.WarehouseQuantities?.map((e)=> `${e.WarehouseName}: ${e.Quantity} ${e.Unit}` ).join(" , ") : "",
         },
        {
            header: t("Action"),
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button
                        onClick={() => {
                            setChildMaterialId(row.original.Id);
                            getChildMaterialById(setChildMaterial, row.original.Id)
                            setUpdateChildMaterialModal(true);
                        }}
                    >
                        <Pen className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmationDialog
                        deleteRow={() => deleteChildMaterial(setChildmaterials, row.original.Id, materialID)}
                    />
                </div>
            ),
        },
    ];

    useEffect(() => {
        getChildMaterialByParentId(setChildmaterials, materialID);
    }, []);

    return (
        <div className="w-full space-y-2">
            <UpdateChildMaterial getChildMaterialByParentId={() => getChildMaterialByParentId(setChildmaterials, materialID)} />
            <NewChildMaterial getChildMaterialByParentId={() => getChildMaterialByParentId(setChildmaterials, materialID)} />
            <div className="w-full space-y-1">
                <div className="w-full space-y-1 flex items-center">
                    <BackButton />
                    <h1 className="text-3xl font-bold w-full">{materialName}</h1>
                </div>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button onClick={() => setNewChildMaterialModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("AddChildMaterial")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={materialColumns} data={childmaterials} />
                </div>
            </div>
        </div>
    );
}
