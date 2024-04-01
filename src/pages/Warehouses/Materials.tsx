import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {deleteMaterial, getAllMaterials} from "@/services/Materials.services";
import {MaterialType} from "@/types/Warehouses/Materials.types.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";

export default function Materials() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState<MaterialType[]>([]);
    const materialColumns: ColumnDef<MaterialType>[] = [
        {
            accessorKey: "Name",
            header: t("Name"),
        },
        {
            accessorKey: "Type",
            header: t("Type"),
        },
        {
            accessorKey: "Category",
            header: t("Category"),
        },  {
            accessorKey: "Color",
            header: t("Color"),
        },  {
            accessorKey: "MinimumStockLevel",
            header: t("MinimumStockLevel"),
        },  {
            accessorKey: "MaximumStockLevel",
            header: t("MaximumStockLevel"),
        },
        {
            accessorKey: "UnitOfMeasure",
            header: t("UnitOfMeasure"),
        },
        {
            accessorKey: "Location",
            header: t("Location"),
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
                                navigate(`/dashboard/materials/${row.original.Id}`);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteMaterial(setMaterials, row.original.Id)}
                        />

                    </div>
                );
            },
        },
    ];
    // Page on load
    useEffect(() => {
        getAllMaterials(setMaterials);
    }, []);
    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">Materials</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button onClick={() => navigate("/dashboard/materials/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("AddMaterial")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={materialColumns} data={materials} />
                </div>
            </div>
        </div>
    );
}
