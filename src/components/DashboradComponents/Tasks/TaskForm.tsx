import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input";
import { departmentList } from "@/store/Department";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}

export default function TaskForm({ form, onSubmit, handleFileChange }: Props) {
  const { t } = useTranslation();
  const departmentLists = useRecoilValue(departmentList);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="task"
      >
        <FormField
          control={form.control}
          name="TaskName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("TaskName")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="DueDate"
          render={({ field }) => (
            <DatePickerForForm label={t("DueDate")} field={field} />
          )}
        />
        <FormField
          control={form.control}
          name="AssignedToDepartmentId"
          render={({ field }) => (
            <SelectFieldForForm
              items={departmentLists}
              placeholder="Select Department"
              label={t("AssignedToDepartment")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Description")}
              field={field}
            />
          )}
        />
        <FormItem>
          <FormLabel>Task File</FormLabel>
          <Input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"
            onChange={handleFileChange}
          />
        </FormItem>
      </form>
    </Form>
  );
}
