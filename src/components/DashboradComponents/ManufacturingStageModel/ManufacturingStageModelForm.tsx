import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { getAllDepartmentList } from "@/services/Departments.services";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import {useTranslation} from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
  SubmitButton: any;
}
const ManufacturingStageModelForm = ({ form, onSubmit, SubmitButton }: Props) => {
  // Departments
  const [departments, setDepartments] = useState([]);
  const { t } = useTranslation();

  // Page on load
  useEffect(() => {
    getAllDepartmentList(setDepartments);
  }, []);
  return (
    <Card style={{ backgroundColor: "var(--background)" }}>
      <CardHeader>{t("Stages")}</CardHeader>
      <CardContent className="space-y-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2"
            id="stages"
          >
            <FormField
              control={form.control}
              name="stageName"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"enter stage name"}
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
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default ManufacturingStageModelForm;
