import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteProductCategoryOne,
  getAllProductCategoryOne,
  getProductCategoryOneById,
} from "@/services/ProductCategoryOne.services.ts";
import {
  newProductCategoryOneModal,
  productCategoryOne,
  productCategoryOneId,
  updateProductCategoryOneModal,
} from "@/store/ProductCategoryOne.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { ProductCategoryOneType } from "@/types/Entities/ProductCategoryOne.types.ts";
import UpdateProductCategoryOne from "@/components/DashboradComponents/Entities/ProductCategoryOne/UpdateProductCategoryOne.tsx";
import NewProductCategoryOne from "@/components/DashboradComponents/Entities/ProductCategoryOne/NewProductCategoryOne.tsx";
import { useTranslation } from "react-i18next";

export default function ProductCategoryOne() {
  const setNewProductCategoryOneModal = useSetRecoilState(
    newProductCategoryOneModal
  );
  const setUpdateProductCategoryOneModal = useSetRecoilState(
    updateProductCategoryOneModal
  );
  const setProductCategoryOneId = useSetRecoilState(productCategoryOneId);
  const setProductCategoryOne = useSetRecoilState(productCategoryOne);
  const [productCategoryOnes, setProductCategoryOnes] = useState<
    ProductCategoryOneType[]
  >([]);
  const { t } = useTranslation();
  const productCategoryOneColumns: ColumnDef<ProductCategoryOneType>[] = [
    {
      accessorKey: "CategoryName",
      header: t("ProductCatalogCategoryOne"),
    },
    {
      accessorKey: "CategoryDescription",
      header: t("Description"),
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setProductCategoryOneId(row.original.Id);
                getProductCategoryOneById(
                  setProductCategoryOne,
                  row.original.Id
                );
                setUpdateProductCategoryOneModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteProductCategoryOne(
                  setProductCategoryOnes,
                  row.original.Id
                )
              }
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllProductCategoryOne(setProductCategoryOnes);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewProductCategoryOne
        getProductCategoriesOne={() =>
          getAllProductCategoryOne(setProductCategoryOnes)
        }
      />
      <UpdateProductCategoryOne
        getProductCategoriesOne={() =>
          getAllProductCategoryOne(setProductCategoryOnes)
        }
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("ProductCategoryOne")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewProductCategoryOneModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable
            columns={productCategoryOneColumns}
            data={productCategoryOnes}
            tableName="ProductCatalogCategoryOne"
            fieldFilter={{
              "CategoryName" : "CategoryName" , 
              "Description" : "CategoryDescription"
            }}
          />
        </div>
      </div>
    </div>
  );
}
