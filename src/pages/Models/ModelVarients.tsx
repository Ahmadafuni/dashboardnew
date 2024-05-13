import NewModelVarientDialog from "@/components/DashboradComponents/Models/NewModelVarientDialog";
import UpdateModelVarientDialog from "@/components/DashboradComponents/Models/UpdateModelVarientDialog";
import BackButton from "@/components/common/BackButton";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  deleteModelVarient,
  getAllModelVarients,
  getModelVarientById,
} from "@/services/ModelVarients.services";
import {
  currentModelVarient,
  currentModelVarientId,
  newModelVarientModal,
  updateModelVarientModal,
} from "@/store/ModelVarients";
import { ModelVarientsTypes } from "@/types/Models/ModelVarients.types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export default function ModelVarients() {
  const setNewModelVarientModal = useSetRecoilState(newModelVarientModal);
  const setUpdateModelVarientModal = useSetRecoilState(updateModelVarientModal);
  const { t } = useTranslation();
  // Navigate
  const navigate = useNavigate();
  const { id } = useParams();
  // Model Varients
  const [modelVarients, setModelVarients] = useState<ModelVarientsTypes[]>([]);
  const setCurrentVarient = useSetRecoilState(currentModelVarient);
  const setCurrentVarientId = useSetRecoilState(currentModelVarientId);

  // Columns
  const modelVarientsColumns: ColumnDef<ModelVarientsTypes>[] = [
    {
      accessorKey: "Model",
      header: "Model",
    },
    {
      accessorKey: "Color",
      header: "Color",
    },
    {
      header: "Sizes",
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => {
              navigate(
                `/dashboard/templates/update/${row.original.TemplateId}`
              );
            }}
          >
            {row.original.Sizes.map((e) => e.label).join(", ")}
          </Button>
        );
      },
    },
    {
      accessorKey: "Quantity",
      header: "Quantity",
    },
    {
      header: "Quantity Details",
      cell: ({ row }) => {
        return <p>{+row.original.Quantity / row.original.Sizes.length}</p>;
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                getModelVarientById(setCurrentVarient, row.original.Id);
                setCurrentVarientId(row.original.Id);
                setUpdateModelVarientModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteModelVarient(setModelVarients, row.original.Id, id)
              }
            />
          </div>
        );
      },
    },
  ];

  // Page on load
  useEffect(() => {
    getAllModelVarients(setModelVarients, id);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewModelVarientDialog
        getAllVarients={() => getAllModelVarients(setModelVarients, id)}
        modelId={id}
      />
      <UpdateModelVarientDialog
        getAllVarients={() => getAllModelVarients(setModelVarients, id)}
        modelId={id}
      />
      <BackButton />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Model Varients</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewModelVarientModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={modelVarientsColumns} data={modelVarients} />
        </div>
      </div>
    </div>
  );
}
