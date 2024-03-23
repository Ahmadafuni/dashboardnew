import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  deleteProductCatalogueDetail,
  getAllProductCatalogueDetails,
} from "@/services/ProductCatalogues.services";
import { ProductCatalogueDetailType } from "@/types/ProductCatalogues/ProductCatalogueDetails.types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

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
      header: "Category One",
      cell: ({ row }) => {
        return <p>{row.original.CategoryOne.CategoryName}</p>;
      },
    },
    {
      header: "Category Two",
      cell: ({ row }) => {
        return <p>{row.original.CategoryTwo.CategoryName}</p>;
      },
    },
    {
      header: "Template Type",
      cell: ({ row }) => {
        return <p>{row.original.TemplateType.TemplateTypeName}</p>;
      },
    },
    {
      header: "Template Pattern",
      cell: ({ row }) => {
        return <p>{row.original.TemplatePattern.TemplatePatternName}</p>;
      },
    },
    {
      header: "Season",
      cell: ({ row }) => {
        return <p>{row.original.Season}</p>;
      },
    },
    {
      header: "Textile",
      cell: ({ row }) => {
        return <p>{row.original.Textile.TextileName}</p>;
      },
    },
    {
      header: "Grammage",
      cell: ({ row }) => {
        return <p>{row.original.Grammage}</p>;
      },
    },
    {
      header: "Standard Weight",
      cell: ({ row }) => {
        return <p>{row.original.StandardWeight}</p>;
      },
    },
    {
      header: "Description",
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
                deleteProductCatalogueDetail(
                  setDetails,
                  row.original.Id,
                  catalogueId
                )
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
        <h1 className="text-3xl font-bold w-full">Product Catalogue Details</h1>
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
