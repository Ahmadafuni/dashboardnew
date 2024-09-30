import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteTextile,
  getAllTextiles,
  getTextileById,
} from "@/services/Textiles.services.ts";
import {
  newTextileModal,
  textile,
  textileId,
  updateTextileModal,
} from "@/store/Textiles.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { TextilesType } from "@/types/Entities/Textiles.types.ts";
import NewTextiles from "@/components/DashboradComponents/Entities/Textiles/NewTextiles.tsx";
import UpdateTextiles from "@/components/DashboradComponents/Entities/Textiles/UpdateTextiles.tsx";
import { useTranslation } from "react-i18next";
import LoadingDialog from "@/components/ui/LoadingDialog";

export default function Textiles() {
  const setNewTextileModal = useSetRecoilState(newTextileModal);
  const setUpdateTextileModal = useSetRecoilState(updateTextileModal);
  const setTextileId = useSetRecoilState(textileId);
  const setTextile = useSetRecoilState(textile);
  const [textiles, setTextiles] = useState<TextilesType[]>([]);
  const { t } = useTranslation();
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const textileColumns: ColumnDef<TextilesType>[] = [
    {
      accessorKey: "TextileName",
      header: t("TextileName"),
    },
    {
      accessorKey: "TextileType",
      header: t("TextileType"),
    },
    {
      accessorKey: "Composition",
      header: t("Composition"),
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
                setTextileId(row.original.Id);
                getTextileById(setTextile, row.original.Id);
                setUpdateTextileModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteTextile(setTextiles, row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllTextiles(setTextiles , pages , sizes , setTotalPages , setIsLoading);
  }, [pages ,sizes]);
  return (
    <div className="w-full space-y-2">
        {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />}  
      <NewTextiles getTextiles={() => getAllTextiles(setTextiles)} />
      <UpdateTextiles getTextiles={() => getAllTextiles(setTextiles)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Textiles")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewTextileModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={textileColumns} data={textiles} tableName="ProductCatalogTextiles"
          page={pages}
          setPage={setPages}
          size={sizes}
          setSize={setSizes}
          totalPages={totalPages}
        
            fieldFilter={{
              "TextileName" : "TextileName" ,
              "TextileType" : "TextileType" ,
              "Composition" : "Composition" , 
              "Description" : "Description"

            }}
          />
        </div>
      </div>
    </div>
  );
}
