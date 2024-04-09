import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { deleteModel, getAllModels } from "@/services/Model.services.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {ModelTypes} from "@/types/Models/Models.types.ts";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import {useNavigate, useParams} from "react-router-dom";

export default function Models() {

    // Param
    const { modelId } = useParams();
    // Navigate
    const navigate = useNavigate();

    const [models, setModels] = useState<ModelTypes[]>([]);
    const { t } = useTranslation();

    const modelColumns: ColumnDef<ModelTypes>[] = [
        {
            accessorKey: "OrderID",
            header: "Order ID",
        },
        {
            accessorKey: "ProductCatalogID",
            header: "Product Catalog ID",
        },
        {
            accessorKey: "CategoryOne",
            header: "Category One",
        },
        {
            accessorKey: "CategoryTwo",
            header: "Category Two",
        },
        {
            accessorKey: "Textile",
            header: "Textile",
        },
        {
            accessorKey: "TemplateID",
            header: "Template ID",
        },
        {
            accessorKey: "Sizes",
            header: "Sizes",
        },
        {
            accessorKey: "Colors",
            header: "Colors",
        },
        {
            accessorKey: "ModelNumber",
            header: "Model Number",
        },
        {
            accessorKey: "ModelName",
            header: "Model Name",
        },
        {
            accessorKey: "TotalQuantity",
            header: "Total Quantity",
        },
        {
            accessorKey: "Characteristics",
            header: "Characteristics",
        },
        {
            accessorKey: "Barcode",
            header: "Barcode",
        },
        {
            accessorKey: "LabelType",
            header: "Label Type",
        },
        {
            accessorKey: "PrintName",
            header: "Print Name",
        },
        {
            accessorKey: "PrintLocation",
            header: "Print Location",
        },
        {
            accessorKey: "Images",
            header: "Images",
        },
        {
            accessorKey: "Status",
            header: "Status",
        },
        {
            accessorKey: "Description",
            header: "Description",
        },
        {
            header: t("Action"),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <ButtonTooltipStructure description="Edit Model">
                        <Button onClick={() => {navigate(`/dashboard/models/update/${row.original.Id}`);}}>
                            <Pen className="h-4 w-4" />
                        </Button>
                    </ButtonTooltipStructure>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteModel(setModels, row.original.Id)}
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllModels(setModels);
    }, []);

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("Models")}</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button  onClick={() => { navigate(`/dashboard/models/new/${modelId}`);}}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("Add")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={modelColumns} data={models} />
                </div>
            </div>
        </div>
    );
}
