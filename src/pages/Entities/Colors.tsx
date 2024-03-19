import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    deleteColor,
    getAllColors,
    getColorById,
} from "@/services/Colors.services.ts";
import {
    newColorModal,
    color,
    colorId,
    updateColorModal,
} from "@/store/Color.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import {ColorType} from "@/types/Entities/Color.types.ts";
import NewColor from "@/components/DashboradComponents/Entities/Colors/NewColor.tsx";
import UpdateColor from "@/components/DashboradComponents/Entities/Colors/UpdateColor.tsx";

export default function Colors() {
    // Modal State
    const setNewColorModal = useSetRecoilState(newColorModal);
    const setUpdateColorModal = useSetRecoilState(updateColorModal);
    const setColorId = useSetRecoilState(colorId);
    // Color
    const setColor = useSetRecoilState(color);
    // Colors
    const [colors, setColors] = useState<ColorType[]>([]); // Assuming ColorType is a type for color objects
    // Columns
    const colorColumns: ColumnDef<ColorType>[] = [
        {
            accessorKey: "ColorName",
            header: "ColorName",
        },
        {
            accessorKey: "ColorCode",
            header: "ColorCode",
        },
        {
            accessorKey: "Description",
            header: "Description",
        },
        {
            header: "Action",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            onClick={() => {
                                setColorId(row.original.id);
                                getColorById(setColor, row.original.id);
                                setUpdateColorModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteColor(row.original.id)}
                        />
                    </div>
                );
            },
        },
    ];
    // Page on load
    useEffect(() => {
        getAllColors(setColors);
    }, []);
    return (
        <div className="w-full space-y-2">
            <NewColor getColors={() => getAllColors(setColors)} />
            <UpdateColor getColors={() => getAllColors(setColors)} />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">Colors</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewColorModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Color
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={colorColumns} data={colors} />
                </div>
            </div>
        </div>
    );
}
