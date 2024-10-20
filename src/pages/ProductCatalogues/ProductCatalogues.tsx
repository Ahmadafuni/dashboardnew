import ButtonTooltipStructure from "@/components/common/ButtonTooltipStructure";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import NewProductCatalogueDialog from "@/components/DashboradComponents/ProductCatalogue/NewProductCatalogueDialog.tsx";
import UpdateProductCatalogueModal from "@/components/DashboradComponents/ProductCatalogue/UpdateProductCatalogueModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  deleteProductCatalogue,
  getAllProductCatalogues,
  getProductCatalogueById,
} from "@/services/ProductCatalogues.services";
import {
  newProductCatalogueModal,
  productCatalogue,
  productCatalogueId,
  updateProductCatalogueModal,
} from "@/store/ProductCatalogue";
import { ProductCatalogueType } from "@/types/ProductCatalogues/ProductCatalogues.types";
import { ColumnDef } from "@tanstack/react-table";
import { ListPlus, Pen, Plus, View } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

export default function ProductCatalogues() {
  const setNewCatalogueModal = useSetRecoilState(newProductCatalogueModal);
  const setUpdateCatalogueModal = useSetRecoilState(
    updateProductCatalogueModal
  );
  // Navigate
  const navigate = useNavigate();
  const setCatalogueId = useSetRecoilState(productCatalogueId);
  const setCatalogue = useSetRecoilState(productCatalogue);
  const [catalogues, setCatalogues] = useState([]);
  const { t } = useTranslation();

  const catalogueColumns: ColumnDef<ProductCatalogueType>[] = [
    {
      accessorKey: "ProductCatalogName",
      header: t("ProductCatalogueName"),
    },
    {
      accessorKey: "ProductCatalogDescription",
      header: t("Description"),
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <ButtonTooltipStructure description="Edit product catalogue">
              <Button
                onClick={() => {
                  setCatalogueId(row.original.Id);
                  getProductCatalogueById(setCatalogue, row.original.Id);
                  setUpdateCatalogueModal(true);
                }}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </ButtonTooltipStructure>
            <ButtonTooltipStructure description="Add product catalogue detail">
              <Button
                onClick={() =>
                  navigate(
                    `/dashboard/productcatalogues/cataloguedetails/new/${row.original.Id}`
                  )
                }
              >
                <ListPlus className="h-4 w-4" />
              </Button>
            </ButtonTooltipStructure>
            <ButtonTooltipStructure description="View product catalogue details">
              <Button
                onClick={() =>
                  navigate(
                    `/dashboard/productcatalogues/cataloguedetails/${row.original.Id}`
                  )
                }
              >
                <View className="h-4 w-4" />
              </Button>
            </ButtonTooltipStructure>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteProductCatalogue(setCatalogues, row.original.Id)
              }
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllProductCatalogues(setCatalogues);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewProductCatalogueDialog
        getCatalogues={() => getAllProductCatalogues(setCatalogues)}
      />
      <UpdateProductCatalogueModal
        getCatalogues={() => getAllProductCatalogues(setCatalogues)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("ProductCatalogues")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewCatalogueModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={catalogueColumns} data={catalogues} />
        </div>
      </div>
    </div>
  );
}
