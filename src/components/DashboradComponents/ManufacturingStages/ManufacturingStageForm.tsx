import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { getAllDepartmentList } from "@/services/Departments.services";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";

interface Props {
  form: any;
  onSubmit: any;
  SubmitButton: any;
}
const ManufacturingStageForm = ({ form, onSubmit, SubmitButton }: Props) => {
  // Departments
  const [departments, setDepartments] = useState([]);
  // Page on load
  useEffect(() => {
    getAllDepartmentList(setDepartments);
  }, []);
  return (
    <Card style={{ backgroundColor: "var(--background)" }}>
      <CardHeader>Manufacturing Stages</CardHeader>
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
                  placeholder={"Stage name"}
                  label={"Stage Name"}
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
                  label={"Department"}
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
                  placeholder={"Duration"}
                  label={"Duration"}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="workDescription"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder={"Work description"}
                  label={"Work Description"}
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

export default ManufacturingStageForm;
