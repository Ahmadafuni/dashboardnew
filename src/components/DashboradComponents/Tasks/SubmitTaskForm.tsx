import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}
export default function SubmitTaskForm({
  form,
  onSubmit,
  handleFileChange,
}: Props) {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="submit-task"
      >
        <FormField
          control={form.control}
          name="Feedback"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder="Give your feedback"
              label={t("Feedback")}
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
