import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ProductCatalogueDetailType } from "@/types/ProductCatalogues/ProductCatalogueDetails.types.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteProductCatalogueDetail,
  getAllProductCatalogueDetails
} from "@/services/ProductCatalogueDetails.services.ts";

export default function ProductCatalogueDetails() {
  // Param
  const { catalogueId } = useParams();
  // Navigate
  const navigate = useNavigate();
  // Translation
  const { t } = useTranslation();
  // details
  const [details, setDetails] = useState([]);

  const detailsColumns: ColumnDef<ProductCatalogueDetailType>[] = [
    {
      header: t("ProductCatalogCategoryOne"),
      cell: ({ row }) => {
        return <p>{row.original.CategoryOne.CategoryName}</p>;
      },
    },
    {
      header: t("ProductCatalogCategoryTwo"),
      cell: ({ row }) => {
        return <p>{row.original.CategoryTwo.CategoryName}</p>;
      },
    },
    {
      header: t("TemplateType"),
      cell: ({ row }) => {
        return <p>{row.original.TemplateType.TemplateTypeName}</p>;
      },
    },
    {
      header: t("TemplatePattern"),
      cell: ({ row }) => {
        return <p>{row.original.TemplatePattern.TemplatePatternName}</p>;
      },
    },
    {
      header: t("Season"),
      cell: ({ row }) => {
        return <p>{row.original.Season}</p>;
      },
    },
    {
      header: t("Textiles"),
      cell: ({ row }) => {
        return <p>{row.original.Textile.TextileName}</p>;
      },
    },
    {
      header: t("Grammage"),
      cell: ({ row }) => {
        return <p>{row.original.Grammage}</p>;
      },
    },
    {
      header: t("StandardWeight"),
      cell: ({ row }) => {
        return <p>{row.original.StandardWeight}</p>;
      },
    },
    {
      header: t("Description"),
      cell: ({ row }) => {
        return <p>{row.original.Description}</p>;
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <ButtonTooltipStructure description="Edit product catalogue detail">
              <Button
                onClick={() => {
                  navigate(
                    `/dashboard/productcatalogues/cataloguedetails/update/${row.original.Id}`
                  );
                }}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </ButtonTooltipStructure>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteProductCatalogueDetail(setDetails, row.original.Id)
              }
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllProductCatalogueDetails(setDetails, catalogueId);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("ProductCatalogueDetails")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              navigate(
                `/dashboard/productcatalogues/cataloguedetails/new/${catalogueId}`
              );
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={detailsColumns} data={details} />
        </div>
      </div>
    </div>
  );
}
