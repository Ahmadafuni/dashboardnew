import DataTable from "@/components/common/DataTable.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  deleteTemplatePattern,
  getAllTemplatePatterns,
  getTemplatePatternById,
} from "@/services/TemplatePattern.services.ts";
import {
  newTemplatePatternModal,
  templatePattern,
  templatePatternId,
  updateTemplatePatternModal,
} from "@/store/TemplatePattern.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { TemplatePatternType } from "@/types/Entities/TemplatePattern.types.ts";
import NewTemplatePattern from "@/components/DashboradComponents/Entities/TemplatePattern/NewTemplatePattern.tsx";
import UpdateTemplatePattern from "@/components/DashboradComponents/Entities/TemplatePattern/UpdateTemplatePattern.tsx";
import { useTranslation } from "react-i18next";
import LoadingDialog from "@/components/ui/LoadingDialog";

export default function TemplatePattern() {
  const setNewTemplatePatternModal = useSetRecoilState(newTemplatePatternModal);
  const setUpdateTemplatePatternModal = useSetRecoilState(
    updateTemplatePatternModal
  );
  const setTemplatePatternId = useSetRecoilState(templatePatternId);
  const setTemplatePattern = useSetRecoilState(templatePattern);
  const [templatePatterns, setTemplatePatterns] = useState<
    TemplatePatternType[]
  >([]);
  const { t } = useTranslation();
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const templatePatternColumns: ColumnDef<TemplatePatternType>[] = [
    {
      accessorKey: "TemplatePatternName",
      header: t("TemplatePatternName"),
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
                setTemplatePatternId(row.original.Id);
                getTemplatePatternById(setTemplatePattern, row.original.Id);
                setUpdateTemplatePatternModal(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() =>
                deleteTemplatePattern(setTemplatePatterns, row.original.Id)
              }
            />
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllTemplatePatterns(setTemplatePatterns , pages , sizes , setTotalPages , setIsLoading);
  }, [pages , sizes]);
  return (
    <div className="w-full space-y-2">
       {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />} 
      <NewTemplatePattern
        getTemplatePatterns={() => getAllTemplatePatterns(setTemplatePatterns)}
      />
      <UpdateTemplatePattern
        getTemplatePatterns={() => getAllTemplatePatterns(setTemplatePatterns)}
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("TemplatePattern")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setNewTemplatePatternModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={templatePatternColumns} data={templatePatterns} tableName="TemplatePatterns" 
         page={pages}
          setPage={setPages}
          size={sizes}
          setSize={setSizes}
          totalPages={totalPages}
         fieldFilter={{
            "TemplatePatternName": "TemplatePatternName" ,
            "Description" : "Description"
          }}
          />
        </div>
      </div>
    </div>
  );
}
