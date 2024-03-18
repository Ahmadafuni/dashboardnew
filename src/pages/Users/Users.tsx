import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserType } from "@/types/Users/Users.types";
import { Pen, Plus, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import UsersDataTable from "@/components/pages/Users/UsersDataTable";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {useTranslation} from 'react-i18next';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
export default function Users() {

  const {t} = useTranslation();
  const navigate = useNavigate();
  const toggleUser = async (id: number) => {
    try {
      const { data } = await axios.get(`auth/toggle-user/${id}`);
      toast.success(data.message);
      getUsers();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
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
            onClick={() => toggleUser(row.original.Id)}
          >
            {row.original.IsActive ? "Activated" : "Disabled"}
          </Button>
        );
      },
    },
    {
      accessorKey: "PhotoPath",
      header: t("ProfilePhoto"),
      cell: (cell) => {
        return (
          <Avatar>
            <AvatarImage
              src={
                "https://dashboardbackendnew.onrender.com" +
                cell.row.original.PhotoPath
              }
              alt="Profile Image"
            />
            <AvatarFallback>{cell.row.original.Firstname[0]}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      header:  t("Action"),
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you want to delete this?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteUser(row.original.Id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  // Users
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("auth/all");
      setUsers(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  // delete user
  const deleteUser = async (id: number) => {
    try {
      const { data } = await axios.delete(`auth/${id}`);
      getUsers();
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Users</h1>
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
          <UsersDataTable columns={userColumns} data={users} />
        </div>
      </div>
    </div>
  );
}
