import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import UpdateChildMaterial from "@/components/DashboradComponents/Stores/ChildMaterials/UpdateChildMaterial";
import NewChildMaterial from "@/components/DashboradComponents/Stores/ChildMaterials/NewChildMaterial";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import {
    deleteChildMaterial,
    getAllChildMaterials, getChildMaterialById,
    getChildMaterialByParentId,
} from "@/services/Materials.services";
import { ChildMaterialType } from "@/types/Warehouses/Materials.types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useSetRecoilState } from "recoil";
import {childMaterial, childMaterialId, newChildMaterialModal, updateChildMaterialModal} from "@/store/ChildMaterial";
import BackButton from "@/components/common/BackButton.tsx";

export default function ChildMaterials() {
    const { materialID } = useParams();
    const { t } = useTranslation();
    const setNewChildMaterialModal = useSetRecoilState(newChildMaterialModal);
    const setUpdateChildMaterialModal = useSetRecoilState(updateChildMaterialModal);
    const setChildMaterialId = useSetRecoilState(childMaterialId);
    const setChildMaterial = useSetRecoilState(childMaterial);

    const [childmaterials, setChildmaterials] = useState<ChildMaterialType[]>([]);
    const materialColumns: ColumnDef<ChildMaterialType>[] = [
        { accessorKey: "Name", header: t("Name") },
        { accessorKey: "DyeNumber", header: t("DyeNumber") },
        { accessorKey: "Halil", header: t("Halil") },
        { accessorKey: "Kashan", header: t("Kashan") },
        { accessorKey: "Phthalate", header: t("Phthalate") },
        { accessorKey: "GramWeight", header: t("GramWeight") },
        { accessorKey: "Description", header: t("Description") },
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
console.log("materialID",materialID);
    useEffect(() => {
        getChildMaterialByParentId(setChildmaterials, materialID);
    }, []);

    return (
        <div className="w-full space-y-2">
            <UpdateChildMaterial getChildMaterialByParentId={() => getChildMaterialByParentId(setChildmaterials, materialID)} />
            <NewChildMaterial getChildMaterials={() => getAllChildMaterials(setChildmaterials, materialID)} />
            <div className="w-full space-y-1">
                <div className="w-full space-y-1 flex items-center">
                    <BackButton />
                    <h1 className="text-3xl font-bold w-full">Child Materials</h1>
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
