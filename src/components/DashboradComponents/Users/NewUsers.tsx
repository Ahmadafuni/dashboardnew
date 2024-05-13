import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { userSchema } from "@/form_schemas/newUserSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import UserForm from "@/components/DashboradComponents/Users/UserForm.tsx";
import Cookies from "js-cookie";
import BackButton from "@/components/common/BackButton";

export default function NewUsers() {
  // translation
  const { t } = useTranslation();
  // Naginate
  const navigate = useNavigate();
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  // Profile Image
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  // Form fields
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstname: "",
      lastname: "",
      phoneNumber: "",
      department: "",
    },
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    setIsLoading(true);
    if (!file) {
      toast.error("Profile photo is required!");
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("profiles", file);
    const userInfo = JSON.stringify(data);
    formData.append("userInfo", userInfo);
    try {
      const newUser = await axios.post("auth/", formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newUser.data.message);
      form.reset();
      setIsLoading(false);
      navigate("/dashboard/users");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full space-y-2">
      <BackButton />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Newuser")}</h1>
        <Separator />
      </div>
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
              t("AddUser")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
