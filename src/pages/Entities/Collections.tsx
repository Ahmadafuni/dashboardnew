import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteCollection,
  getAllCollections,
  getCollectionById,
} from "@/services/Collection.services.ts";
import {
  Collection,
  CollectionId,
  newCollectionModal,
  updateCollectionModal,
} from "@/store/Collection.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { CollectionType } from "@/types/Entities/Collections.types.ts";
import NewCollection from "@/components/DashboradComponents/Entities/Collections/NewCollection.tsx";
import UpdateCollection from "@/components/DashboradComponents/Entities/Collections/UpdateCollection.tsx";

export default function Collections() {
  const setNewCollectionModal = useSetRecoilState(newCollectionModal);
  const setUpdateCollectionModal = useSetRecoilState(updateCollectionModal);
  const setCollectionId = useSetRecoilState(CollectionId);
  const setCollection = useSetRecoilState(Collection);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const { t } = useTranslation();

  const collectionColumns: ColumnDef<CollectionType>[] = [
    {
      accessorKey: "CollectionName",
      header: t("CollectionName"),
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setCollectionId(row.original.Id);
                getCollectionById(setCollection, row.original.Id);
                setUpdateCollectionModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteCollection(setCollections, row.original.Id)
              }
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllCollections(setCollections);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewCollection
        getAllCollections={() => getAllCollections(setCollections)}
      />
      <UpdateCollection
        getAllCollections={() => getAllCollections(setCollections)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Collections")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewCollectionModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={collectionColumns} data={collections} />
        </div>
      </div>
    </div>
  );
}
