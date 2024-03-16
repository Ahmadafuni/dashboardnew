import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userUpdateSchema } from "@/form_schemas/newUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const roles = [
  { label: "CUTTING", value: "CUTTING" },
  { label: "TAILORING", value: "TAILORING" },
  { label: "PRINTING", value: "PRINTING" },
  { label: "QUALITYASSURANCE", value: "QUALITYASSURANCE" },
  { label: "ENGINEERING", value: "ENGINEERING" },
  { label: "FACTORYMANAGER", value: "FACTORYMANAGER" },
  { label: "WAREHOUSEMANAGER", value: "WAREHOUSEMANAGER" },
];
const categories = [
  { label: "MANAGEMENT", value: "MANAGEMENT" },
  { label: "PRODUCTION", value: "PRODUCTION" },
  { label: "SERVICES", value: "SERVICES" },
];
export default function UpdateUser() {
  // Param
  const { userID } = useParams();
  // Loding
  const [isLoading, setIsLoading] = useState(false);
  // User
  const [user, setUser] = useState({
    username: "",
    role: "",
    email: "",
    firstname: "",
    lastname: "",
    phoneNumber: "",
    category: "",
    password: "",
  });
  // Get User
  const getUser = async () => {
    try {
      const { data } = await axios.get(`auth/${userID}`);
      setUser(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
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
      role: "",
      email: "",
      firstname: "",
      lastname: "",
      phoneNumber: "",
      category: "",
      password: "",
    },
    values: { ...user },
  });
  const onSubmit = async (data: z.infer<typeof userUpdateSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profiles", file);
    const userInfo = JSON.stringify(data);
    formData.append("userInfo", userInfo);
    try {
      const newUser = await axios.put(`auth/${userID}`, formData);
      toast.success(newUser.data.message);
      getUser();
      setIsLoading(false);
      setFile(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">New User</h1>
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
                  placeholder={"Jhon"}
                  label={"Firstname"}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"Doe"}
                  label={"Lastname"}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"jhon.doe"}
                  label={"Username"}
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
                  label={"Email"}
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
                  label={"Phone Number"}
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
                  label={"Password"}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <SelectFieldForForm
                  label="Role"
                  field={field}
                  placeholder="Select Role"
                  items={roles}
                />
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <SelectFieldForForm
                  label="Category"
                  field={field}
                  placeholder="Select Category"
                  items={categories}
                />
              )}
            />
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
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
              "Update"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
