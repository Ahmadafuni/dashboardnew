import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteProductCategoryTwo,
  getAllProductCategoryTwo,
  getProductCategoryTwoById,
} from "@/services/ProductCategoryTwo.services.ts";
import {
  newProductCategoryTwoModal,
  productCategoryTwo,
  productCategoryTwoId,
  updateProductCategoryTwoModal,
} from "@/store/ProductCategoryTwo.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import UpdateProductCategoryTwo from "@/components/DashboradComponents/Entities/ProductCategoryTwo/UpdateProductCategoryTwo.tsx";
import NewProductCategoryTwo from "@/components/DashboradComponents/Entities/ProductCategoryTwo/NewProductCategoryTwo.tsx";
import { useTranslation } from "react-i18next";
import { ProductCategoryOneType } from "@/types/Entities/ProductCategoryOne.types";

export default function ProductCategoryTwo() {
  // Modal State
  const setNewProductCategoryTwoModal = useSetRecoilState(
    newProductCategoryTwoModal
  );
  const setUpdateProductCategoryTwoModal = useSetRecoilState(
    updateProductCategoryTwoModal
  );
  const setProductCategoryTwoId = useSetRecoilState(productCategoryTwoId);
  const setProductCategoryTwo = useSetRecoilState(productCategoryTwo);
  const [productCategoryTwos, setProductCategoryTwos] = useState<
    ProductCategoryOneType[]
  >([]);
  const { t } = useTranslation();

  const productCategoryTwoColumns: ColumnDef<ProductCategoryOneType>[] = [
    {
      accessorKey: "CategoryName",
      header: t("ProductCatalogCategoryTwo"),
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
                setProductCategoryTwoId(row.original.Id);
                getProductCategoryTwoById(
                  setProductCategoryTwo,
                  row.original.Id
                );
                setUpdateProductCategoryTwoModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteProductCategoryTwo(
                  setProductCategoryTwos,
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
    getAllProductCategoryTwo(setProductCategoryTwos);
  }, []);

  return (
    <div className="w-full space-y-2">
      <NewProductCategoryTwo
        getProductCategoriesTwo={() =>
          getAllProductCategoryTwo(setProductCategoryTwos)
        }
      />
      <UpdateProductCategoryTwo
        getProductCategoriesTwo={() =>
          getAllProductCategoryTwo(setProductCategoryTwos)
        }
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">
          {" "}
          {t("ProductCategoryTwo")}
        </h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewProductCategoryTwoModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable
            columns={productCategoryTwoColumns}
            data={productCategoryTwos}
            tableName="ProductCatalogCategoryTwo"
          />
        </div>
      </div>
    </div>
  );
}
