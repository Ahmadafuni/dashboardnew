import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/ui/LoadingDialog";
import { Separator } from "@/components/ui/separator";
import { downLoadFile } from "@/services/Commons.services";
import { deleteTemplate, getAllTemplates } from "@/services/Templates.services";
import { TemplateType } from "@/types/Templates/Templates.types";
import { ColumnDef } from "@tanstack/table-core";
import { Download, Pen, Plus, ScanEye } from "lucide-react";
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
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Columns
  const templateColumns: ColumnDef<TemplateType>[] = [
    {
      accessorKey: "TemplateName",
      header: t("TemplateName"),
    },
    {
      header: t("ProductCatalogueName"),
      accessorFn: (row) => row.ProductCatalogue.ProductCatalogName || t("N/A"),
      cell: ({ row }) => {
        return <p>{row.original.ProductCatalogue.ProductCatalogName}</p>;
      },
    },
    {
      header: t("Season"),
      accessorFn: (row) => row.Season || t("N/A"),

      cell: ({ row }) => {
        return <p>{row.original.Season}</p>;
      },
    },
    {
      header: t("ProductCatalogCategoryOne"),
      accessorFn: (row) => row.CategoryOne.CategoryName || t("N/A"),

      cell: ({ row }) => {
        return <p>{row.original.CategoryOne.CategoryName}</p>;
      },
    },
    {
      header: t("ProductCatalogCategoryTwo"),
      accessorFn: (row) => row.CategoryTwo.CategoryName || t("N/A"),

      cell: ({ row }) => {
        return <p>{row.original.CategoryTwo.CategoryName}</p>;
      },
    },
    {
      header: t("TemplateType"),
      accessorFn: (row) => row.TemplateType.TemplateTypeName || t("N/A"),

      cell: ({ row }) => {
        return <p>{row.original.TemplateType.TemplateTypeName}</p>;
      },
    },
    {
      header: t("TemplatePattern"),
      accessorFn: (row) => row.TemplatePattern.TemplatePatternName || t("N/A"),

      cell: ({ row }) => {
        return <p>{row.original.TemplatePattern.TemplatePatternName}</p>;
      },
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: t("File"),
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
            <Download className="w-4 h-4 mr-2" /> {t("Download")}
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
            <Button
              onClick={() =>
                window.open(
                  `/templates/viewdetails/${row.original.Id}`,
                  "_blank"
                )
              }
            >
              <ScanEye className="w-4 h-4" />
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
    getAllTemplates(setTemplates , pages , sizes , setTotalPages , setIsLoading);
  }, [pages , sizes]);

  return (
    <div className="w-full space-y-2">
 
        {isLoading && <LoadingDialog 
                    isOpen={isLoading} 
                    message="Loading..." 
                    subMessage="Please wait, your request is being processed now." 
                  />} 

      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Templates")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/dashboard/templates/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={templateColumns} data={templates} tableName="Templates"
            page={pages}
            setPage={setPages}
            size={sizes}
            setSize={setSizes}
            totalPages={totalPages}
            fieldFilter={{
              "TemplateName" : "TemplateName",
              "ProductCatalogueName":"ProductCatalogId.ProductCatalogName",
              "ProductCategoryOne" : "CategoryOneId.CategoryName",
              "ProductCategoryTwo" : "CategoryTwoId.CategoryName" ,
              "TemplateTypeName" : "TemplateTypeId.TemplateTypeName" ,
              "TemplatePatternName" : "TemplatePatternId.TemplatePatternName" ,
              "Description" : "Description",
            }}
          />
        </div>
      </div>
    </div>
  );
}
