import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  deleteChildMaterial,
  getAllChildMaterials,
} from "@/services/Materials.services";
import { ChildMaterialType } from "@/types/Warehouses/Materials.types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function ChildMaterials() {
  const { materialID } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<ChildMaterialType[]>([]);
  const materialColumns: ColumnDef<ChildMaterialType>[] = [
    {
      accessorKey: "Name",
      header: t("Name"),
    },
    {
      header: t("Parent"),
      cell: ({ row }) => <p>{row.original.ParentMaterial.Name}</p>,
    },
    {
      accessorKey: "DyeNumber",
      header: t("DyeNumber"),
    },
    {
      accessorKey: "Halil",
      header: t("Halil"),
    },
    {
      accessorKey: "Kashan",
      header: t("Kashan"),
    },
    {
      accessorKey: "Phthalate",
      header: t("Phthalate"),
    },
    {
      accessorKey: "GramWeight",
      header: t("GramWeight"),
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            onClick={() =>
              navigate(`/dashboard/materials/child/update/${row.original.Id}`)
            }
          >
            <Pen className="h-4 w-4" />
          </Button>
          <DeleteConfirmationDialog
            deleteRow={() =>
              deleteChildMaterial(setMaterials, row.original.Id, materialID)
            }
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllChildMaterials(setMaterials, materialID);
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Materials</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() =>
              navigate(`/dashboard/materials/child/new/${materialID}`)
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("AddChildMaterial")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={materialColumns} data={materials} />
        </div>
      </div>
    </div>
  );
}
