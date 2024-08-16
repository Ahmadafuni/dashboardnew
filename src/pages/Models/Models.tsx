import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {deleteModel, getModelsByOrderId, holdModel, restartModel} from "@/services/Model.services.ts";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pen, Plus, ScanEye } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModelTypes } from "@/types/Models/Models.types.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BackButton from "@/components/common/BackButton";
import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog.tsx";

export default function Models() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const [models, setModels] = useState<ModelTypes[]>([]);

  const modelColumns: ColumnDef<ModelTypes>[] = [
     {
       accessorKey: "DemoModelNumber",
       header: t("ModelNumber"),
    },
    {
      header: t("ProductCatalogues"),
      cell: ({ row }) => {
        return <p>{row.original.ProductCatalog.ProductCatalogName}</p>;
      },
    },
    {
      header: t("ProductCategoryOne"),
      cell: ({ row }) => {
        return <p>{row.original.CategoryOne.CategoryName}</p>;
      },
    },
    {
      header: t("ProductCategoryTwo"),
      cell: ({ row }) => {
        return <p>{row.original.categoryTwo.CategoryName}</p>;
      },
    },
    {
      header: t("Textiles"),
      cell: ({ row }) => {
        return <p>{row.original.Textile.TextileName}</p>;
      },
    },
    {
      header: t("Template"),
      cell: ({ row }) => {
        return <p>{row.original.Template.TemplateName}</p>;
      },
    },
    {
      accessorKey: "ModelName",
      header: t("ModelName"),
    },
    {
      accessorKey: "Barcode",
      header: t("Barcode"),
    },
    {
      accessorKey: "Status",
      cell: ({ row }) => {
        return (
            <div className="space-x-1">

              {row.original.RunningStatus === "RUNNING" ? (
                  <BasicConfirmationDialog
                      btnText={t("Pause")}
                      takeAction={(reason: string) => holdModel(setModels, row.original.Id, reason)}
                      className="bg-orange-500 hover:bg-orange-600"
                      showInput={true}
                  />
              ) : (
                  <BasicConfirmationDialog
                      btnText={t("Restart")}
                      takeAction={() => restartModel(setModels, row.original.Id)}
                      className="bg-green-500 hover:bg-green-600"
                  />
              )
              }
            </div>
        )
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <DeleteConfirmationDialog
              deleteRow={() => deleteModel(setModels, row.original.Id, id)}
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
                      navigate(
                        `/dashboard/orders/model/update/${id}/${row.original.Id}`
                      );
                    }}
                  >
                    <Pen className="mr-2 h-4 w-4" />
                    <span>{t("EditModel")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(
                        `/dashboard/orders/model/varients/${row.original.Id}`
                      )
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>{t("ViewDetails")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        `/models/viewdetails/${row.original.Id}`,
                        "_blank"
                      )
                    }
                  >
                    <ScanEye className="mr-2 h-4 w-4" />
                    <span>{t("ViewSummary")}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getModelsByOrderId(setModels, id);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        {models.length > 0 && (
          <h1 className="text-3xl font-bold w-full">
            {models[0].OrderNumber}
          </h1>
        )}
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              navigate(`/dashboard/orders/model/new/${id}`);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={modelColumns} data={models} />
        </div>
      </div>
    </div>
  );
}
