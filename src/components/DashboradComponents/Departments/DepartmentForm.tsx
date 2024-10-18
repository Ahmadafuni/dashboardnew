import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
export default function DepartmentForm({ form, onSubmit }: Props) {
  // Translation
  const { t } = useTranslation();
  // Categories
    const categories = [
        { label: t("CUTTING"), value: "CUTTING" },
        { label: t("TAILORING"), value: "TAILORING" },
        { label: t("PRINTING"), value: "PRINTING" },
        { label: t("QUALITYASSURANCE"), value: "QUALITYASSURANCE" },
        { label: t("ENGINEERING"), value: "ENGINEERING" },
        { label: t("FACTORYMANAGER"), value: "FACTORYMANAGER" },
        { label: t("WAREHOUSEMANAGER"), value: "WAREHOUSEMANAGER" },
        { label: t("HUMANRESOURCE"), value: "HumanResource" },
        { label: t("MOTHERCOMPANY"), value: "MotherCompany" },
        { label: t("ACCOUNTING"), value: "Accounting" },
        { label: t("DRAWING"), value: "DRAWING" },
    ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="department"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={""}
              label={t("Name")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={""}
              label={t("Location")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("Category")}
              placeholder=""
              items={categories}
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={""}
              label={t("Description")}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
