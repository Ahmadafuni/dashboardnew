import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    deleteTextile,
    getAllTextiles,
    getTextileById,
} from "@/services/Textiles.services.ts";
import {
    newTextileModal,
    textile,
    textileId,
    updateTextileModal,
} from "@/store/Textiles.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { TextilesType } from "@/types/Entities/Textiles.types.ts";
import NewTextiles from "@/components/DashboradComponents/Entities/Textiles/NewTextiles.tsx";
import UpdateTextiles from "@/components/DashboradComponents/Entities/Textiles/UpdateTextiles.tsx";

export default function Textiles() {
    // Modal State
    const setNewTextileModal = useSetRecoilState(newTextileModal);
    const setUpdateTextileModal = useSetRecoilState(updateTextileModal);
    const setTextileId = useSetRecoilState(textileId);
    // Textile
    const setTextile = useSetRecoilState(textile);
    // Textiles
    const [textiles, setTextiles] = useState<TextilesType[]>([]);
    // Columns
    const textileColumns: ColumnDef<TextilesType>[] = [
        {
            accessorKey: "TextileName",
            header: "TextileName",
        },
        {
            accessorKey: "TextileType",
            header: "TextileType",
        },
        {
            accessorKey: "Composition",
            header: "Composition",
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
                                setTextileId(row.original.id);
                                getTextileById(setTextile, row.original.id);
                                setUpdateTextileModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteTextile(row.original.id)}
                        />
                    </div>
                );
            },
        },
    ];
    // Page on load
    useEffect(() => {
        getAllTextiles(setTextiles);
    }, []);
    return (
        <div className="w-full space-y-2">
            <NewTextiles getTextiles={() => getAllTextiles(setTextiles)} />
            <UpdateTextiles getTextiles={() => getAllTextiles(setTextiles)} />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">Textiles</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewTextileModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Textile
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={textileColumns} data={textiles} />
                </div>
            </div>
        </div>
    );
}
