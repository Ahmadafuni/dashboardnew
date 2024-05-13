import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import MultiSelectFieldForForm from "@/components/common/MultiSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { colorList } from "@/store/Color";
import { sizeList } from "@/store/Sizes";
import { useRecoilValue } from "recoil";
import {useTranslation} from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ModelVarientForm({ form, onSubmit }: Props) {
  // Dropdown
  const colorsList = useRecoilValue(colorList);
  const sizesList = useRecoilValue(sizeList);
  const { t } = useTranslation();

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
                label={t("Colors")}
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
              label={t("Sizes")}
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
              label={t("Quantity")}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
