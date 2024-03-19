import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import NewProductCatalogueModal from "@/components/pages/ProductCatalogue/NewProductCatalogueModal";
import UpdateProductCatalogue from "@/components/pages/ProductCatalogue/UpdateProductCatalogue";
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
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export default function ProductCatalogues() {
  // Modal State
  const setNewCatalogueModal = useSetRecoilState(newProductCatalogueModal);
  const setUpdateCatalogueModal = useSetRecoilState(
    updateProductCatalogueModal
  );
  const setCatalogueId = useSetRecoilState(productCatalogueId);
  // Catalogue
  const setCatalogue = useSetRecoilState(productCatalogue);
  // Catalogues
  const [catalogues, setCatalogues] = useState([]);
  // Columns
  const userColumns: ColumnDef<ProductCatalogueType>[] = [
    {
      accessorKey: "ProductCatalogName",
      header: "Product Catalogue Name",
    },
    {
      accessorKey: "ProductCatalogDescription",
      header: "Product Catalogue Description",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setCatalogueId(row.original.Id);
                getProductCatalogueById(setCatalogue, row.original.Id);
                setUpdateCatalogueModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
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
      <NewProductCatalogueModal
        getCatalogues={() => getAllProductCatalogues(setCatalogues)}
      />
      <UpdateProductCatalogue
        getCatalogues={() => getAllProductCatalogues(setCatalogues)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Product Catalogues</h1>
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
            Add Product Catalogue
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={userColumns} data={catalogues} />
        </div>
      </div>
    </div>
  );
}
