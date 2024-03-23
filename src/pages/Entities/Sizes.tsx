import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteSize,
  getAllSizes,
  getSizeById,
} from "@/services/Sizes.service.ts";
import { newSizeModal, size, sizeId, updateSizeModal } from "@/store/Sizes.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { SizeType } from "@/types/Entities/Size.types.ts";
import NewSize from "@/components/DashboradComponents/Entities/Sizes/NewSize.tsx";
import UpdateSize from "@/components/DashboradComponents/Entities/Sizes/UpdateSize.tsx";
import { useTranslation } from "react-i18next";

export default function Sizes() {
  const setNewSizeModal = useSetRecoilState(newSizeModal);
  const setUpdateSizeModal = useSetRecoilState(updateSizeModal);
  const setSizeId = useSetRecoilState(sizeId);
  const setSize = useSetRecoilState(size);
  const [sizes, setSizes] = useState<SizeType[]>([]);
  const { t } = useTranslation();

  const sizeColumns: ColumnDef<SizeType>[] = [
    {
      accessorKey: "SizeName",
      header: t("SizeName"),
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
                setSizeId(row.original.Id);
                getSizeById(setSize, row.original.Id);
                setUpdateSizeModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteSize(row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllSizes(setSizes);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewSize getSizes={() => getAllSizes(setSizes)} />
      <UpdateSize getSizes={() => getAllSizes(setSizes)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Sizes")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewSizeModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={sizeColumns} data={sizes} />
        </div>
      </div>
    </div>
  );
}
