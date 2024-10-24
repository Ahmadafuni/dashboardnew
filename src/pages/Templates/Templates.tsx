import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { downLoadFile } from "@/services/Commons.services";
import { deleteTemplate, getAllTemplates } from "@/services/Templates.services";
import { TemplateType } from "@/types/Templates/Templates.types";
import { ColumnDef } from "@tanstack/table-core";
import { Download, Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Templates() {
  // Translation
  const { t } = useTranslation();
  // Navigate
  const navigate = useNavigate();
  // Departments
  const [templates, setTemplates] = useState([]);

  // Columns
  const templateColumns: ColumnDef<TemplateType>[] = [
    {
      accessorKey: "TemplateName",
      header: "Template Name",
    },
    {
      header: "Product Catalogue",
      cell: ({ row }) => {
        return (
          <p>
            {
              row.original.ProductCatalogDetail.ProductCatalog
                .ProductCatalogName
            }
          </p>
        );
      },
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: "File",
      cell: ({ row }) => {
        return (
          <Button
            type="button"
            disabled={row.original.FilePath.length <= 0 ? true : false}
            onClick={() =>
              downLoadFile(
                "https://dashboardbackendnew.onrender.com" +
                  row.original.FilePath
              )
            }
          >
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        );
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() =>
                navigate(`/dashboard/templates/update/${row.original.Id}`)
              }
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteTemplate(setTemplates, row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllTemplates(setTemplates);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Templates</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/dashboard/templates/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={templateColumns} data={templates} />
        </div>
      </div>
    </div>
  );
}
