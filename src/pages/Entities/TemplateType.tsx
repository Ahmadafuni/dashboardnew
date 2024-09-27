import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteTemplateType,
  getAllTemplateTypes,
  getTemplateTypeById,
} from "@/services/TemplateType.services.ts";
import {
  newTemplateTypeModal,
  templateType,
  templateTypeId,
  updateTemplateTypeModal,
} from "@/store/TemplateType.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { TemplateTypeType } from "@/types/Entities/TemplateType.types.ts";
import NewTemplateType from "@/components/DashboradComponents/Entities/TemplateType/NewTemplateType.tsx";
import UpdateTemplateType from "@/components/DashboradComponents/Entities/TemplateType/UpdateTemplateType.tsx";
import { useTranslation } from "react-i18next";

export default function TemplateType() {
  const setNewTemplateTypeModal = useSetRecoilState(newTemplateTypeModal);
  const setUpdateTemplateTypeModal = useSetRecoilState(updateTemplateTypeModal);
  const setTemplateTypeId = useSetRecoilState(templateTypeId);
  const setTemplateType = useSetRecoilState(templateType);
  const [templateTypes, setTemplateTypes] = useState<TemplateTypeType[]>([]);
  const { t } = useTranslation();

  const templateTypeColumns: ColumnDef<TemplateTypeType>[] = [
    {
      accessorKey: "TemplateTypeName",
      header: t("TemplateTypeName"),
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setTemplateTypeId(row.original.Id);
                getTemplateTypeById(setTemplateType, row.original.Id);
                setUpdateTemplateTypeModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteTemplateType(setTemplateTypes, row.original.Id)
              }
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllTemplateTypes(setTemplateTypes);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewTemplateType
        getTemplateTypes={() => getAllTemplateTypes(setTemplateTypes)}
      />
      <UpdateTemplateType
        getTemplateTypes={() => getAllTemplateTypes(setTemplateTypes)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("TemplateType")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewTemplateTypeModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={templateTypeColumns} data={templateTypes} tableName="TemplateTypes"/>
        </div>
      </div>
    </div>
  );
}
