import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}

const TextilesDialog = ({ form, onSubmit }: Props) => {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="textile"
      >
        <FormField
          control={form.control}
          name="textileName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("TextileName")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="textileType"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("TextileType")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="composition"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Composition")}
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

export default TextilesDialog;
