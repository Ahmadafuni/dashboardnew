import UserForm from "@/components/DashboradComponents/Users/UserForm.tsx";
import BackButton from "@/components/common/BackButton";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { userUpdateSchema } from "@/form_schemas/newUserSchema.ts";
import { getUserById } from "@/services/Users.services.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function UpdateUser() {
  // Param
  const { userID } = useParams();
  // Navigation state
  const navigate = useNavigate();
  // Loding
  const [isLoading, setIsLoading] = useState(false);
  // User
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    phoneNumber: "",
    password: "",
    department: "",
  });
  // File
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0].name);
  };
  // Form fields
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      phoneNumber: "",
      password: "",
      department: user.department,
    },
    values: user,
  });
  const onSubmit = async (data: z.infer<typeof userUpdateSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    if (file !== null) {
      formData.append("profiles", file);
    }
    const userInfo = JSON.stringify(data);
    formData.append("userInfo", userInfo);
    try {
      const updateUser = await axios.put(`auth/${userID}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(updateUser.data.message);
      setIsLoading(false);
      navigate("/dashboard/users");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  // Page on load
  useEffect(() => {
    getUserById(setUser, userID);
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold w-full">Update User</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <UserForm
          form={form}
          handleFileChange={handleFileChange}
          onSubmit={onSubmit}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="user">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
