import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Plus, Pen, PencilRuler } from "lucide-react";
import {
  deleteTemplateSize,
  getAllTemplateSizes,
  getTemplateSizeById,
} from "@/services/TemplateSizes.services";
import { TemplateSizesType } from "@/types/Templates/TemplateSizes.types.ts";
import { ColumnDef } from "@tanstack/react-table";
import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import DataTable from "@/components/common/DataTable";
import UpdateTemplateSize from "@/components/DashboradComponents/TemplateSizes/UpdateTemplateSize";
import { useSetRecoilState } from "recoil";
import {
  templateSize,
  templateSizeId,
  updateTemplateSizeModal,
} from "@/store/templateSize";

export default function TemplateSizes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [templateSizes, setTemplateSizes] = useState<TemplateSizesType[]>([]);
  const setUpdateSizeModal = useSetRecoilState(updateTemplateSizeModal);
  const setSize = useSetRecoilState(templateSize);
  const setSizeId = useSetRecoilState(templateSizeId);

  const sizeColumns: ColumnDef<TemplateSizesType>[] = [
    {
      accessorKey: "Name",
      header: t("Name"),
    },
    {
      header: "Template",
      cell: ({ row }) => <p>{row.original.Template.TemplateName}</p>,
    },
    {
      header: "Size Type",
      cell: ({ row }) => <p>{row.original.TemplateSizeType}</p>,
    },
    {
      header: "Size",
      cell: ({ row }) => <p>{row.original.Size.SizeName}</p>,
    },
    {
      header: t("Description"),
      cell: ({ row }) => <p>{row.original.Size.SizeName}</p>,
    },
    {
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-1">
          <ButtonTooltipStructure description="Edit template size">
            <Button
              onClick={() => {
                setSizeId(row.original.Id);
                getTemplateSizeById(setSize, row.original.Id);
                setUpdateSizeModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
          </ButtonTooltipStructure>
          <ButtonTooltipStructure description="View Measurements">
            <Button
              onClick={() =>
                navigate(
                  `/dashboard/templates/templatesizes/measurements/${row.original.Id}`
                )
              }
            >
              <PencilRuler className="h-4 w-4" />
            </Button>
          </ButtonTooltipStructure>
          <DeleteConfirmationDialog
            deleteRow={() =>
              deleteTemplateSize(setTemplateSizes, row.original.Id, templateId)
            }
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllTemplateSizes(setTemplateSizes, templateId);
  }, []);
  return (
    <div className="w-full space-y-2">
      <UpdateTemplateSize
        getSizes={() => getAllTemplateSizes(setTemplateSizes, templateId)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("TemplateSizes")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              navigate(`/dashboard/templates/templatesizes/new/${templateId}`);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={sizeColumns} data={templateSizes} />
        </div>
      </div>
    </div>
  );
}
