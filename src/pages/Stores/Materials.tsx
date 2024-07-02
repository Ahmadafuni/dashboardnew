import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  Eye,
  Pen,
  Plus,
  View,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  deleteMaterial,
  getAllMaterials,
  getMaterialById,
} from "@/services/Materials.services.ts";
import { MaterialType } from "@/types/Warehouses/Materials.types.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import { useSetRecoilState } from "recoil";
import {
  newExternalMovementModal,
  newInternalMovementModal,
} from "@/store/MaterialMovement.ts";
import { Checkbox } from "@/components/ui/checkbox";
import NewInternalMovement from "@/components/DashboradComponents/Stores/MaterialMovement/NewInternalMovement";
import { material } from "@/store/Material";
import NewExternalMovement from "@/components/DashboradComponents/Stores/MaterialMovement/NewExternalMovement";

export default function Materials() {
  const setInternalModal = useSetRecoilState(newInternalMovementModal);
  const setExternalModal = useSetRecoilState(newExternalMovementModal);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const setCurrentMaterial = useSetRecoilState(material);
  const materialColumns: ColumnDef<MaterialType>[] = [
    { accessorKey: "Name", header: t("Name") },
    {
      header: t("Category"),
      cell: ({ row }) => <p>{row.original.Category.CategoryName}</p>,
    },
    { accessorKey: "UnitOfMeasure", header: t("UnitOfMeasure") },
    { accessorKey: "MinimumLimit", header: t("MinimumLimit") },
    { accessorKey: "UsageLocation", header: t("UsageLocation") },
    { accessorKey: "AlternativeMaterials", header: t("AlternativeMaterials") },
    {
      header: t("IsRelevantToProduction"),
      cell: ({ row }) => (
        <Checkbox checked={row.original.IsRelevantToProduction} disabled />
      ),
    },
    {
      header: t("HasChildren"),
      cell: ({ row }) => (
        <Checkbox checked={row.original.HasChildren} disabled />
      ),
    },
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
            <DeleteConfirmationDialog
              deleteRow={() => deleteMaterial(setMaterials, row.original.Id)}
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
                    onClick={() =>
                      navigate(`/dashboard/materials/${row.original.Id}`)
                    }
                  >
                    <Pen className="mr-2 h-4 w-4" />
                    <span>{t("EditParentMaterial")}</span>
                  </DropdownMenuItem>
                  {row.original.HasChildren && (
                    <>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/dashboard/materials/child/new/${row.original.Id}`
                          )
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>New Child</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/dashboard/materials/child/${row.original.Id}`
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Child</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      getMaterialById(
                        setCurrentMaterial,
                        row.original.Id.toString()
                      );
                      setInternalModal(true);
                    }}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    <span>Internal</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      getMaterialById(
                        setCurrentMaterial,
                        row.original.Id.toString()
                      );
                      setExternalModal(true);
                    }}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    <span>External</span>
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
      <NewInternalMovement />
      <NewExternalMovement />
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
