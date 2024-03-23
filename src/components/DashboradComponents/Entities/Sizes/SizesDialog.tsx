import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}

const SizesDialog = ({ form, onSubmit }: Props) => {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="size"
      >
        <FormField
          control={form.control}
          name="sizeName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("SizeName")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Description")}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
};

export default SizesDialog;
