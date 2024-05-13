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
import BackButton from "@/components/common/BackButton";

export default function Departments() {
  // Translation
  const { t } = useTranslation();
  // Navigate
  const navigate = useNavigate();
  // Departments
  const [departments, setDepartments] = useState([]);
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
    getAllDepartments(setDepartments);
  }, []);
  return (
    <div className="w-full space-y-2">
      <BackButton />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Departments</h1>
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
          <DataTable columns={departmentColumns} data={departments} />
        </div>
      </div>
    </div>
  );
}
