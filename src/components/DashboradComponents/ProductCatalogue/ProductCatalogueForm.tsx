import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ProductCatalogueForm({ form, onSubmit }: Props) {
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
              placeholder={"Product Catalogue Name"}
              label={"Product Catalogue Name"}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Product Catalogue Description"}
              label={"Product Catalogue Description"}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
