import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import {
    deleteMaterialMovement,
    getMaterialMovementsByMovementType,
} from "@/services/MaterialMovements.services";
import { materialMovementList } from "@/store/MaterialMovement";
import NewMovement from "@/components/DashboradComponents/Warehouse/MaterialMovement/NewMovement.tsx";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Eye, Pen } from "lucide-react";

export default function IncomingMovement() {
    const { t } = useTranslation();
    const [materialMovements, setMaterialMovements] = useRecoilState(materialMovementList);

    // حالة التحكم بالتعديل أو الإضافة
    const [selectedMovement, setSelectedMovement] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // للتحكم بحالة التعديل
    const [isDialogOpen, setIsDialogOpen] = useState(false); // للتحكم بفتح الـ Dialog سواء للإضافة أو التعديل

    const movementFromOptions = [
        { label: t("Department"), value: "Department" },
        { label: t("Warehouse"), value: "Warehouse" },
        { label: t("Supplier"), value: "Supplier" },
    ];
    const movementToOptions = [{ label: t("Warehouse"), value: "Warehouse" }];

    const materialMovementsColumns: ColumnDef<any>[] = [
        { accessorKey: "invoiceNumber", header: t("InvoiceNumber") },
        { accessorKey: "parentMaterialName", header: t("ParentMaterialName") },
        { accessorKey: "childMaterialName", header: t("ChildMaterialName") },
        { accessorKey: "movedFrom", header: t("MovedFrom") },
        { accessorKey: "movedTo", header: t("MovedTo") },
        { accessorKey: "quantity", header: t("Quantity") },
        { accessorKey: "unitOfQuantity", header: t("UnitOfQuantity") },
        {
            accessorKey: "movementDate",
            header: t("Date"),
            cell: ({ row }) => {
                const date = new Date(row.original.movementDate);
                return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
            },
        },
        { accessorKey: "modelName", header: t("ModelName") },
        { accessorKey: "description", header: t("Description") },
        {
            header: t("Action"),
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <DeleteConfirmationDialog
                        deleteRow={() =>
                            deleteMaterialMovement(
                                setMaterialMovements,
                                row.original.id,
                                "INCOMING"
                            )
                        }
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <EllipsisVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-52">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedMovement(row.original);
                                        setIsEditing(true); // تمكين وضع التعديل
                                        setIsDialogOpen(true); // فتح الـ Dialog
                                    }}
                                >
                                    <Pen className="mr-2 h-4 w-4" />
                                    <span>{t("EditParentMaterial")}</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {
                                        // عرض التفاصيل
                                    }}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>{t("Details")}</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getMaterialMovementsByMovementType(setMaterialMovements, "INCOMING");
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [setMaterialMovements]);

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("MaterialMovements")}</h1>
                <Separator />
            </div>

            <button
                className="bg-blue-900 dark:bg-blue-900 text-white p-2 rounded transition-colors duration-500 hover:bg-blue-800 dark:hover:bg-blue-900"
                onClick={() => {
                    setIsEditing(false); 
                    setSelectedMovement(null); 
                    setIsDialogOpen(true); 
                }}
            >
                {t("AddNewMovement")}
            </button>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm" />
                    <Dialog.Content
                        className="fixed bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                    text-black dark:text-white max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                                {isEditing ? t("EditMovement") : t("NewMovement")}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
                                {isEditing
                                    ? t("EditDetailsForMovement")
                                    : t("FillTheDetailsForNewMovement")}
                            </DialogDescription>
                        </DialogHeader>

                        <NewMovement
                            movementFromOptions={movementFromOptions}
                            movementToOptions={movementToOptions}
                            movementType="INCOMING"
                            defaultValues={selectedMovement}
                            typeAction= {isEditing
                                ? t("Edit")
                                : t("Add")}
                        />

                        <DialogFooter className="mt-4 flex justify-end space-x-2">
                            <Dialog.Close asChild>
                                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
                                    {t("Cancel")}
                                </button>
                            </Dialog.Close>
                        </DialogFooter>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* جدول الحركات */} 
            <div className="space-y-2">
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable
                        columns={materialMovementsColumns}
                        data={materialMovements ?? []}
                        tableName="ChildMaterials"
                    />
                </div>
            </div>
        </div>
    );
}

