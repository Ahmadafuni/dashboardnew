import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pen, Plus, View } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { deleteMaterial, getAllMaterials } from "@/services/Materials.services.ts";
import { MaterialType } from "@/types/Warehouses/Materials.types.ts";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import { useSetRecoilState } from "recoil";
import { Checkbox } from "@/components/ui/checkbox";
import { materialId } from "@/store/Material";
import {newChildMaterialModal} from "@/store/ChildMaterial.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Materials() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const setMaterialId = useSetRecoilState(materialId);
  const setNewChildMaterialModal = useSetRecoilState(newChildMaterialModal);

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
                              onClick={() => {
                                setMaterialId(row.original.Id);
                                setNewChildMaterialModal(true);
                              }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            <span>{t("New Child")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                              onClick={() => {
                                console.log("ROW",row.original)
                                setMaterialId(row.original.Id);
                                navigate(`/dashboard/materials/child/${row.original.Id}`)
                              }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>{t("View Child")}</span>
                          </DropdownMenuItem>
                        </>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        );
      },
    },
  ];

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
