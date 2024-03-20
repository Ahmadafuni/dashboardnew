import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import {useTranslation} from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ProductCatalogueDialog({ form, onSubmit }: Props) {
    const { t } = useTranslation();
    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="catalogue"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("ProductCatalogueName")}
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
