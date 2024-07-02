import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ChildMaterialForm({ form, onSubmit }: Props) {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="material-child"
      >
        <FormField
          control={form.control}
          name="Name"
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
          name="DyeNumber"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("DyeNumber")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Kashan"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Kashan")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Halil"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Halil")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Phthalate"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Phthalate")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="GramWeight"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("GramWeight")}
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
      </form>
    </Form>
  );
}
