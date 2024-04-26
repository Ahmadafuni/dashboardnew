import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import MultiSelectFieldForForm from "@/components/common/MultiSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { colorList } from "@/store/Color";
import { sizeList } from "@/store/Sizes";
import { useRecoilValue } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ModelVarientForm({ form, onSubmit }: Props) {
  // Dropdown
  const colorsList = useRecoilValue(colorList);
  const sizesList = useRecoilValue(sizeList);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="model-varient"
      >
        <FormField
          control={form.control}
          name="Color"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label="Color"
                placeholder="Search Color..."
                emptyBox="No color found"
                form={form}
                name="Color"
                selectText="Select Color"
                items={colorsList}
              />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="Sizes"
          render={({ field }) => (
            <MultiSelectFieldForForm
              label="Sizes"
              selectText="Select Color"
              form={form}
              name="Sizes"
              items={sizesList}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Quantity"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder="Enter quantity"
              label="Quantity"
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
