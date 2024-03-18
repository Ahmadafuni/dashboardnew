import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userSchema } from "@/form_schemas/newUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import {useTranslation} from "react-i18next";

export default function NewUsers() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0].name);
  };
  // Departments
  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    try {
      const { data } = await axios.get("department");
      setDepartments(data.data);
    } catch (error) {}
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
      const newUser = await axios.post("auth/", formData);
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

  useEffect(() => {
    getDepartments();
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Newuser")}</h1>
        <Separator />
      </div>
      <div className="space-y-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2"
            id="new-user"
          >
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={""}
                  label={t("Firstname")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={""}
                  label={t("Lastname")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={""}
                  label={t("Username")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"jhon.doe@emaple.com"}
                  label={t("Email")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"+9320000000"}
                  label={t("PhoneNumber")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"Password"}
                  label={t("Password")}
                  field={field}
                  type="text"
                />
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <SelectFieldForForm
                  field={field}
                  label={t("Department")}
                  placeholder="Select a department"
                  items={departments}
                />
              )}
            />
            <FormItem>
              <FormLabel>{t("ProfilePhoto")}</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </FormItem>
          </form>
        </Form>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} form="new-user">
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
