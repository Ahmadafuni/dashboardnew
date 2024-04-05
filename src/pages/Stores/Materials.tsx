import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleChevronDown,
  DeleteIcon,
  Pen,
  Plus,
  SquareMinus,
  SquarePlus,
  View,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  deleteMaterial,
  getAllMaterials,
} from "@/services/Materials.services.ts";
import { MaterialType } from "@/types/Warehouses/Materials.types.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import NewMaterialMovement from "@/components/DashboradComponents/Stores/MaterialMovement/NewMaterialMovement.tsx";
import { useRecoilState } from "recoil";
import { newMaterialMovementModal } from "@/store/MaterialMovement.ts";

export default function Materials() {
  // @ts-expect-error
  const [open, setOpen] = useRecoilState(newMaterialMovementModal);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const materialColumns: ColumnDef<MaterialType>[] = [
    { accessorKey: "Name", header: t("Name") },
    { accessorKey: "Type", header: t("Type") },
    { accessorKey: "Category", header: t("Category") },
    { accessorKey: "Color", header: t("Color") },
    { accessorKey: "MinimumStockLevel", header: t("MinimumStockLevel") },
    { accessorKey: "MaximumStockLevel", header: t("MaximumStockLevel") },
    { accessorKey: "UnitOfMeasure", header: t("UnitOfMeasure") },
    { accessorKey: "Location", header: t("Location") },
    { accessorKey: "Description", header: t("Description") },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <ButtonTooltipStructure description="View Movements">
              <Button
                onClick={() =>
                  navigate(`/dashboard/materialmovements/${row.original.Id}`)
                }
              >
                <View className="h-4 w-4" />
              </Button>
            </ButtonTooltipStructure>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <CircleChevronDown>Open</CircleChevronDown>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/dashboard/materials/${row.original.Id}`)
                    }
                  >
                    <Pen className="mr-2 h-4 w-4" />
                    <span>Edit Material</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DeleteConfirmationDialog
                      deleteRow={() =>
                        deleteMaterial(setMaterials, row.original.Id)
                      }
                    />
                    <DeleteIcon className="mr-2 h-4 w-4" />
                    <span>Delete Material</span>
                  </DropdownMenuItem>
                  <NewMaterialMovement movementType={"Incoming"} />
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <SquarePlus className="mr-2 h-4 w-4" />
                    <span>Incoming</span>
                  </DropdownMenuItem>
                  <NewMaterialMovement movementType={"Outgoing"} />
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <SquareMinus className="mr-2 h-4 w-4" />
                    <span>Outgoing</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
