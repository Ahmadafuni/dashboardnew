import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { deleteModel, getAllModels } from "@/services/Model.services.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModelTypes } from "@/types/Models/Models.types.ts";
// import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Models() {
  // Navigate
  const navigate = useNavigate();
  const { id } = useParams();

  const [models, setModels] = useState<ModelTypes[]>([]);
  const { t } = useTranslation();

  const modelColumns: ColumnDef<ModelTypes>[] = [
    {
      accessorKey: "OrderNumber",
      header: "Order Number",
    },
    {
      header: "Product Catalog",
      cell: ({ row }) => {
        return <p>{row.original.ProductCatalog.ProductCatalogName}</p>;
      },
    },
    {
      header: "Category One",
      cell: ({ row }) => {
        return <p>{row.original.CategoryOne.CategoryName}</p>;
      },
    },
    {
      header: "Category Two",
      cell: ({ row }) => {
        return <p>{row.original.categoryTwo.CategoryName}</p>;
      },
    },
    {
      header: "Textile",
      cell: ({ row }) => {
        return <p>{row.original.Textile.TextileName}</p>;
      },
    },
    {
      header: "Template",
      cell: ({ row }) => {
        return <p>{row.original.Template.TemplateName}</p>;
      },
    },
    // {
    //   header: "Size",
    //   cell: ({ row }) => {
    //     return <p>{row.original.Size.SizeName}</p>;
    //   },
    // },
    // {
    //   header: "Color",
    //   cell: ({ row }) => {
    //     return <p>{row.original.Color.ColorName}</p>;
    //   },
    // },
    {
      accessorKey: "ModelNumber",
      header: "Model Number",
    },
    {
      accessorKey: "ModelName",
      header: "Model Name",
    },
    // {
    //   accessorKey: "TotalQuantity",
    //   header: "Total Quantity",
    // },
    // {
    //   accessorKey: "Quantity",
    //   header: "Quantity",
    // },
    {
      accessorKey: "Characteristics",
      header: "Characteristics",
    },
    {
      accessorKey: "Barcode",
      header: "Barcode",
    },
    {
      accessorKey: "LabelType",
      header: "Label Type",
    },
    {
      accessorKey: "PrintName",
      header: "Print Name",
    },
    {
      accessorKey: "PrintLocation",
      header: "Print Location",
    },
    {
      header: "Images",
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage
              src={
                "https://dashboardbackendnew.onrender.com" +
                row.original.Images.split(",")[0]
              }
              alt="Profile Image"
            />
            <AvatarFallback>{row.original.ModelName[0]}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
    },
    {
      accessorKey: "Description",
      header: "Description",
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            {/* <ButtonTooltipStructure description="Edit Model">
              <Button
                // disabled={row.original.Status !== "AWAITING"}
                onClick={() => {
                  navigate(`/dashboard/orders/model/update/${row.original.Id}`);
                }}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </ButtonTooltipStructure> */}
            <DeleteConfirmationDialog
              deleteRow={() => deleteModel(setModels, row.original.Id, id)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllModels(setModels, id);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Models")}</h1>
        <Separator />
      </div>
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
