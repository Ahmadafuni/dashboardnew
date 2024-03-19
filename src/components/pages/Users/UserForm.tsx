import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAllDepartmentList } from "@/services/Departments.services";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}
export default function UserForm({ form, onSubmit, handleFileChange }: Props) {
  // translation
  const { t } = useTranslation();
  // Departments
  const [departments, setDepartments] = useState([]);
  // Page on load
  useEffect(() => {
    getAllDepartmentList(setDepartments);
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="user"
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
  );
}
