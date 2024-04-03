import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}
export default function UpdateTemplateForm({
  form,
  onSubmit,
  handleFileChange,
}: Props) {
  // Translation
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-3 gap-2"
        id="template-update"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter template name"}
              label={t("Name")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter template description"}
              label={t("Description")}
              field={field}
            />
          )}
        />
        <FormItem>
          <FormLabel>Template PDF</FormLabel>
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </FormItem>
      </form>
    </Form>
  );
}
