import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteCollection,
  getAllCollections,
  getCollectionById,
  toggleArchivedCollectionById,
} from "@/services/Collection.services.ts";
import {
  Collection,
  CollectionId,
  newCollectionModal,
  updateCollectionModal,
} from "@/store/Collection.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, EllipsisVertical, Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { CollectionType } from "@/types/Entities/Collections.types.ts";
import NewCollection from "@/components/DashboradComponents/Entities/Collections/NewCollection.tsx";
import UpdateCollection from "@/components/DashboradComponents/Entities/Collections/UpdateCollection.tsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

export default function Collections() {
  const setNewCollectionModal = useSetRecoilState(newCollectionModal);
  const setUpdateCollectionModal = useSetRecoilState(updateCollectionModal);
  const setCollectionId = useSetRecoilState(CollectionId);
  const setCollection = useSetRecoilState(Collection);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const { t } = useTranslation();

  const handleRemoveModelFromArchive = async (collectionId: number) => {
    console.log(collectionId);

    await toggleArchivedCollectionById(collectionId, true);
    await getAllCollections(false, setCollections);
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-35 bg-black bg-opacity-50	mr-5 p-2 rounded-2xl">
                <DropdownMenuItem
                  onClick={() => handleRemoveModelFromArchive(row.original.Id)}
                  className=" pt-2 pb-2 pl-4 pr-4 flex gap-1  cursor-pointer	hover:bg-green-700 rounded-md"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  <span>{t("Archive Collection")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllCollections(false, setCollections);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewCollection
        getAllCollections={() => getAllCollections(false, setCollections)}
      />
      <UpdateCollection
        getAllCollections={() => getAllCollections(false, setCollections)}
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
          <DataTable columns={collectionColumns} data={collections} tableName="Collections" />
        </div>
      </div>
    </div>
  );
}
