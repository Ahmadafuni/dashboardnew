import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}

export default function SupplierForm({ form, onSubmit }: Props) {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="supplier"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Name")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Address")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("PhoneNumber")}
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
}
