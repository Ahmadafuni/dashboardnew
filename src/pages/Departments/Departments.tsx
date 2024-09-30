import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DepartmentType } from "@/types/Departments/Departments.types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllDepartments } from "@/services/Departments.services";
import LoadingDialog from "@/components/ui/LoadingDialog";

export default function Departments() {
  // Translation
  const { t } = useTranslation();
  // Navigate
  const navigate = useNavigate();
  // Departments
  const [departments, setDepartments] = useState([]);

  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Columns
  const departmentColumns: ColumnDef<DepartmentType>[] = [
    {
      accessorKey: "Name",
      header: t("Name"),
    },
    {
      accessorKey: "Category",
      header: t("Category"),
    },
    {
      accessorKey: "Location",
      header: t("Location"),
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
                navigate(`/dashboard/departments/${row.original.Id}`);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  // Page on load
  useEffect(() => {
    getAllDepartments(setDepartments , pages , sizes , setTotalPages , setIsLoading);
  }, [pages , sizes]);
  return (
    <div className="w-full space-y-2">
      {isLoading && 
            <LoadingDialog 
            isOpen={isLoading} 
            message="Loading..." 
            subMessage="Please wait, your request is being processed now." 
          />}
          
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full"> {t("Departments")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/dashboard/departments/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("AddDepartment")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={departmentColumns} data={departments} tableName="Departments"
          page={pages}
          setPage={setPages}
          size={sizes}
          setSize={setSizes}
          totalPages={totalPages}
          fieldFilter={{
            "Name" : "Name" , 
            "Location" : "Location" , 
            "Description" : "Description"
          }}
          />
        </div>
      </div>
    </div>
  );
}
