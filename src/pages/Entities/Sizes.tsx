import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    deleteSize,
    getAllSizes,
    getSizeById,
} from "@/services/Sizes.service.ts";
import {
    newSizeModal,
    size,
    sizeId,
    updateSizeModal,
} from "@/store/Sizes.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { SizeType } from "@/types/Entities/Size.types.ts";
import NewSize from "@/components/DashboradComponents/Entities/Sizes/NewSize.tsx";
import UpdateSize from "@/components/DashboradComponents/Entities/Sizes/UpdateSize.tsx";

export default function Sizes() {
    // Modal State
    const setNewSizeModal = useSetRecoilState(newSizeModal);
    const setUpdateSizeModal = useSetRecoilState(updateSizeModal);
    const setSizeId = useSetRecoilState(sizeId);
    // Size
    const setSize = useSetRecoilState(size);
    // Sizes
    const [sizes, setSizes] = useState<SizeType[]>([]);
    // Columns
    const sizeColumns: ColumnDef<SizeType>[] = [
        {
            accessorKey: "SizeName",
            header: "SizeName",
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
                                setSizeId(row.original.id);
                                getSizeById(setSize, row.original.id);
                                setUpdateSizeModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteSize(row.original.id)}
                        />
                    </div>
                );
            },
        },
    ];
    // Page on load
    useEffect(() => {
        getAllSizes(setSizes);
    }, []);
    return (
        <div className="w-full space-y-2">
            <NewSize getSizes={() => getAllSizes(setSizes)} />
            <UpdateSize getSizes={() => getAllSizes(setSizes)} />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">Sizes</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewSizeModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Size
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={sizeColumns} data={sizes} />
                </div>
            </div>
        </div>
    );
}
