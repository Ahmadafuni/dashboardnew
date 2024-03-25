import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productCatalogueDetailsList } from "@/store/ProductCatalogueDetails";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}
export default function TemplateForm({
  form,
  onSubmit,
  handleFileChange,
}: Props) {
  // Translation
  const { t } = useTranslation();
  // Product Catalogue Details List
  const pcdsList = useRecoilValue(productCatalogueDetailsList);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="template"
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
          name="productCatalogDetailId"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Product Catalogue Detail"}
              placeholder="Search Product Catalogue Detail..."
              emptyBox="No product catalogue detail found"
              form={form}
              name="productCatalogDetailId"
              selectText="Select Product Catalogue Detail"
              items={pcdsList}
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
          <FormLabel>{"Template PDF"}</FormLabel>
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
