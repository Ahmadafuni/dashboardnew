import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import {
    newMaterialCategoryModal,
    updateMaterialCategoryModal,
    materialCategoryId,
    materialCategory,
} from "@/store/MaterialCategory.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { MaterialCategoryType } from "@/types/Warehouses/MaterialCategory.types.ts";
import NewMaterialCategory from "@/components/DashboradComponents/Warehouse/MaterialCategory/NewMaterialCategory.tsx";
import UpdateMaterialCategory from "@/components/DashboradComponents/Warehouse/MaterialCategory/UpdateMaterialCategory.tsx";
import {
    deleteMaterialCategory,
    getAllMaterialCategories,
    getMaterialCategoryById,
} from "@/services/MaterialCategory.services.ts";
import LoadingDialog from "@/components/ui/LoadingDialog";

export default function MaterialCategories() {
    const { t } = useTranslation();
    const [materialCategories, setMaterialCategories] = useState<
        MaterialCategoryType[]
    >([]);
    const setCurrentMaterialCategory = useSetRecoilState(materialCategory);
    const setNewMaterialCategoryModal = useSetRecoilState(
        newMaterialCategoryModal
    );
    const setUpdateMaterialCategoryModal = useSetRecoilState(
        updateMaterialCategoryModal
    );
    const setMaterialCategoryId = useSetRecoilState(materialCategoryId);
    const [pages, setPages] = useState(1);
    const [sizes, setSizes] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const materialCategoryColumns: ColumnDef<MaterialCategoryType>[] = [
        {
            accessorKey: "CategoryName",
            header: t("CategoryName"),
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
                                setMaterialCategoryId(row.original.Id);
                                getMaterialCategoryById(
                                    setCurrentMaterialCategory,
                                    row.original.Id
                                );
                                setUpdateMaterialCategoryModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() =>
                                deleteMaterialCategory(setMaterialCategories, row.original.Id)
                            }
                        />
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        getAllMaterialCategories(setMaterialCategories , pages , sizes , setTotalPages , setIsLoading);
    }, [pages , sizes]);

    return (
        <div className="w-full space-y-2">
            {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />}
            <NewMaterialCategory
                getMaterialCategories={() =>
                    getAllMaterialCategories(setMaterialCategories)
                }
            />
            <UpdateMaterialCategory
                getMaterialCategories={() =>
                    getAllMaterialCategories(setMaterialCategories)
                }
            />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("MaterialCategories")}</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewMaterialCategoryModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("AddMaterialCategory")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable
                        columns={materialCategoryColumns}
                        data={materialCategories}
                        tableName="MaterialCategories"
                        page={pages}
                        setPage={setPages}
                        size={sizes}
                        setSize={setSizes}
                        totalPages={totalPages}
                        
                    />
                </div>
            </div>
        </div>
    );
}
