import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteColor,
  getAllColors,
  getColorById,
} from "@/services/Colors.services.ts";
import {
  newColorModal,
  color,
  colorId,
  updateColorModal,
} from "@/store/Color.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { ColorType } from "@/types/Entities/Color.types.ts";
import NewColor from "@/components/DashboradComponents/Entities/Colors/NewColor.tsx";
import UpdateColor from "@/components/DashboradComponents/Entities/Colors/UpdateColor.tsx";
import { useTranslation } from "react-i18next";
import LoadingDialog from "@/components/ui/LoadingDialog";

export default function Colors() {
  const setNewColorModal = useSetRecoilState(newColorModal);
  const setUpdateColorModal = useSetRecoilState(updateColorModal);
  const setColorId = useSetRecoilState(colorId);
  const { t } = useTranslation();
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const setColor = useSetRecoilState(color);
  const [colors, setColors] = useState<ColorType[]>([]); // Assuming ColorType is a type for color objects
  const colorColumns: ColumnDef<ColorType>[] = [
    {
      id: "ColorName",
      header: t("ColorName"),
      accessorFn: (row) => row.ColorName,
    },
    {
      id: "ColorCode",
      accessorFn: (row) => row.ColorCode,
      header: t("ColorCode"),
    },
    {
      id: "Demo",
      header: t("Demo"),
      accessorFn: (row) => row.ColorCode,

      cell: ({ row }) => {
        return (
          <div
            className="w-4 h-4 border-1 rounded-sm"
            style={{ backgroundColor: row.original.ColorCode }}
          ></div>
        );
      },
    },
    {
      id: "Description",
      header: t("Description"),
      accessorFn: (row) => row.Description,
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setColorId(row.original.Id);
                getColorById(setColor, row.original.Id);
                setUpdateColorModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteColor(setColors, row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllColors(setColors , pages , sizes , setTotalPages , setIsLoading);
  }, [pages , sizes]);
  return (
    <div className="w-full space-y-2">
      {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />}  
      <NewColor getColors={() => getAllColors(setColors)} />
      <UpdateColor getColors={() => getAllColors(setColors)} />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full"> {t("Colors")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewColorModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable 
            columns={colorColumns} 
            data={colors} 
            tableName="Colors"
            page={pages}
            setPage={setPages}
            size={sizes}
            setSize={setSizes}
            totalPages={totalPages}
            fieldFilter={
              {
                'ColorName': 'ColorName',
                'ColorCode': 'ColorCode',
                "Description": 'Description'
              }
            }
            />
        </div>
      </div>
    </div>
  );
}
