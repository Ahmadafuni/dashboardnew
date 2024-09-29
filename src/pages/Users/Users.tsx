import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserType } from "@/types/Users/Users.types";
import { Pen, Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import DataTable from "@/components/common/DataTable";
import { deleteUser, getAllUsers, toggleUser } from "@/services/Users.services";
export default function Users() {
  // Users
  const [users, setUsers] = useState([]);
  // Translation
  const { t } = useTranslation();
  // Navigation
  const navigate = useNavigate();
  // Column Def
  const userColumns: ColumnDef<UserType>[] = [
    {
      accessorKey: "Firstname",
      header: t("Firstname"),
    },
    {
      accessorKey: "Lastname",
      header: t("Lastname"),
    },
    {
      accessorKey: "Username",
      header: t("Username"),
    },
    {
      accessorKey: "Email",
      header: t("Email"),
    },
    {
      accessorKey: "PhoneNumber",
      header: t("PhoneNumber"),
    },
    {
      header: t("Department"),
      accessorFn: (row) => row.Department?.Name,
    },
    {
      accessorKey: "IsActive",
      header: t("IsActive"),
      cell: ({ row }) => {
        return (
          <Button
            variant={row.original.IsActive ? "default" : "destructive"}
            className={
              row.original.IsActive ? "bg-green-500 hover:bg-green-400" : ""
            }
            onClick={() => toggleUser(setUsers, row.original.Id)}
          >
            {row.original.IsActive ? "Activated" : "Disabled"}
          </Button>
        );
      },
    },
    {
      header: t("ProfilePhoto"),
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage
              src={
                "https://dashboardbackendnew.onrender.com" +
                row.original.PhotoPath
              }
              alt="Profile Image"
            />
            <AvatarFallback>{row.original.Firstname[0]}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                navigate(`/dashboard/users/${row.original.Id}`);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <DeleteConfirmationDialog
              deleteRow={() => deleteUser(setUsers, row.original.Id)}
            />
          </div>
        );
      },
    },
  ];
  // On page load
  useEffect(() => {
    getAllUsers(setUsers);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Users")}</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/dashboard/users/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("AddUser")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={userColumns} data={users} tableName="Users" 
          fieldFilter={{
            "Firstname" : "Firstname" , 
            "Lastname" : "Lastname" , 
            "Username" : "Username" , 
            "Email" : "Email" , 
            "PhoneNumber" : "PhoneNumber" , 
            "Department" : "DepartmentId.Name"
          }}
          />
        </div>
      </div>
    </div>
  );
}
