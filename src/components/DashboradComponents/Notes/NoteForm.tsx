import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { useRecoilValue } from "recoil";
import { departmentList } from "@/store/Department";

interface Props {
  form: any;
  onSubmit: any;
}

export default function NoteForm({ form, onSubmit }: Props) {
  const { t } = useTranslation();
  const departmentLists = useRecoilValue(departmentList);
  const noteTypes = [
    { value: "GENERAL", label:  t("GENERAL")},
    { value: "REMINDER", label: t("REMINDER")},
    { value: "ATTENTION", label:t("ATTENTION")},
  ];
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="note"
      >
        <FormField
          control={form.control}
          name="NoteType"
          render={({ field }) => (
            <SelectFieldForForm
              placeholder="Select Note Type"
              label={t("NoteType")}
              items={noteTypes}
              field={field}
            />
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
              placeholder="Note description"
              label={t("Description")}
              field={field}
              rows={3}
            />
          )}
        />
      </form>
    </Form>
  );
}
