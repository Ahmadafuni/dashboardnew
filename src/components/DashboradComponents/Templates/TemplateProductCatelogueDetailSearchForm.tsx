import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { useRecoilValue } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
}
export default function TemplateProductCatelogueDetailSearchForm({
  form,
  onSubmit,
}: Props) {
  // Dropdown state
  const categoryOneList = useRecoilValue(productCategoryOneList);
  const categoryTwoList = useRecoilValue(productCategoryTwoList);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="template-pcd-search"
      >
        <FormField
          control={form.control}
          name="categoryOne"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Category One"}
              placeholder="Search Category One..."
              emptyBox="No category one found"
              form={form}
              name="categoryOne"
              selectText="Select Category One"
              items={categoryOneList}
            />
          )}
        />
        <FormField
          control={form.control}
          name="categoryTwo"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Category Two"}
              placeholder="Search Category Two..."
              emptyBox="No category two found"
              form={form}
              name="categoryTwo"
              selectText="Select Category Two"
              items={categoryTwoList}
            />
          )}
        />
      </form>
    </Form>
  );
}
