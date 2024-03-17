import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DepartmentType } from "@/types/Departments/Departments.types";
import { ColumnDef } from "@tanstack/react-table";
import axios, { AxiosError } from "axios";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Departments() {
  // Navigation state
  const navigate = useNavigate();
  // Column Def
  const userColumns: ColumnDef<DepartmentType>[] = [
    {
      accessorKey: "Name",
      header: "Name",
    },
    {
      accessorKey: "Category",
      header: "Category",
    },
    {
      accessorKey: "Location",
      header: "Location",
    },
    {
      accessorKey: "Description",
      header: "Description",
    },
    {
      header: "Action",
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

  // Departments
  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    try {
      const { data } = await axios.get("department/all");
      setDepartments(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Departments</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/dashboard/departments/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={userColumns} data={departments} />
        </div>
      </div>
    </div>
  );
}
