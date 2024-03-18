import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import NewProductCatalogueModal from "@/components/pages/ProductCatalogue/NewProductCatalogueModal";
import UpdateProductCatalogue from "@/components/pages/ProductCatalogue/UpdateProductCatalogue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  newProductCatalogueModal,
  productCatalogue,
  productCatalogueId,
  updateProductCatalogueModal,
} from "@/store/ProductCatalogue";
import { ProductCatalogueType } from "@/types/ProductCatalogues/ProductCatalogues.types";
import { ColumnDef } from "@tanstack/react-table";
import axios, { AxiosError } from "axios";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "sonner";

export default function ProductCatalogues() {
  // Modal State
  const setNewCatalogueModal = useSetRecoilState(newProductCatalogueModal);
  const setUpdateCatalogueModal = useSetRecoilState(
    updateProductCatalogueModal
  );
  const setCatalogueId = useSetRecoilState(productCatalogueId);

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
                getCatalogue(row.original.Id);
                setUpdateCatalogueModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteCatalogue={() => deleteCatalogue(row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // Catalogue
  const setCatalogue = useSetRecoilState(productCatalogue);
  // Get Catalogue
  const getCatalogue = async (catalogueId: number) => {
    try {
      const { data } = await axios.get(`productcatalog/${catalogueId}`);
      setCatalogue(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
  // Catalogues
  const [catalogues, setCatalogues] = useState([]);
  const getCatalogues = async () => {
    try {
      const { data } = await axios.get("productcatalog/all");
      setCatalogues(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
  // Delete Catalogue
  const deleteCatalogue = async (catalogueId: number) => {
    try {
      const { data } = await axios.delete(`productcatalog/${catalogueId}`);
      toast.success(data.message);
      getCatalogues();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    getCatalogues();
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewProductCatalogueModal getCatalogues={getCatalogues} />
      <UpdateProductCatalogue getCatalogues={getCatalogues} />
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
