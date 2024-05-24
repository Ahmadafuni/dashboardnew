import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { getAllDepartmentList } from "@/services/Departments.services";
import { useEffect, useState } from "react";
import {useTranslation} from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
export default function UpdateManufacturingStageForm({
  form,
  onSubmit,
}: Props) {
  // Departments
  const [departments, setDepartments] = useState([]);
  const { t } = useTranslation();

    // Page on load
  useEffect(() => {
    getAllDepartmentList(setDepartments);
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="update-stage"
      >
        <FormField
          control={form.control}
          name="stageName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Stage name"}
              label={t("StageName")}
              field={field}
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
              placeholder="Select department"
              items={departments}
            />
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"enter duration"}
              label={t("Duration")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="workDescription"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"enter work description"}
              label={t("WorkDescription")}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
