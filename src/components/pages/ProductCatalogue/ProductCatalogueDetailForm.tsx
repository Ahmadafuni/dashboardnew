import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
const categoryOne = [
  { label: "Pant", value: "Pant" },
  { label: "Shirt", value: "Shirt" },
];
const seasons = [
  { label: "SUMMER", value: "SUMMER" },
  { label: "FALL", value: "FALL" },
  { label: "WINTER", value: "WINTER" },
  { label: "SPRING", value: "SPRING" },
];
export default function ProductCatalogueDetailForm({ form, onSubmit }: Props) {
  // Translation
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="catalogue-detail"
      >
        <FormField
          control={form.control}
          name="category1"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Category One"}
              placeholder="Search Category One..."
              emptyBox="No category one found"
              form={form}
              name="category1"
              selectText="Select Category One"
              items={categoryOne}
            />
          )}
        />
        <FormField
          control={form.control}
          name="category2"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Category Two"}
              placeholder="Search Category Two..."
              emptyBox="No category two found"
              form={form}
              name="category2"
              selectText="Select Category Two"
              items={categoryOne}
            />
          )}
        />
        <FormField
          control={form.control}
          name="templateType"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Template Type"}
              placeholder="Search Template Type..."
              emptyBox="No template type found"
              form={form}
              name="templateType"
              selectText="Select Template Type"
              items={categoryOne}
            />
          )}
        />
        <FormField
          control={form.control}
          name="templatePattern"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Template Pattern"}
              placeholder="Search Template Pattern..."
              emptyBox="No template pattern found"
              form={form}
              name="templatePattern"
              selectText="Select Template Pattern"
              items={categoryOne}
            />
          )}
        />
        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("Season")}
              placeholder="Select a season..."
              items={seasons}
            />
          )}
        />
        <FormField
          control={form.control}
          name="textile"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Textile"}
              placeholder="Search Textile..."
              emptyBox="No textile found"
              form={form}
              name="textile"
              selectText="Select Textile"
              items={categoryOne}
            />
          )}
        />
        <FormField
          control={form.control}
          name="grammage"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter grammage"}
              label={"Grammage"}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="standardWeight"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter standard weight"}
              label={"Standard Weight"}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Description"}
              label={"Description"}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
