import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { getAllSizesList } from "@/services/Sizes.service";
import { useEffect, useState } from "react";
import {useTranslation} from "react-i18next";

interface Props {
  form: any;
  onSubmit: any;
}
export default function UpdateMeasurementForm({ form, onSubmit }: Props) {
  // Sizes State
  const [sizes, setSizes] = useState<any[]>([]);
  const { t } = useTranslation();
    useEffect(() => {
    getAllSizesList(setSizes);
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="update-measurement"
      >
        <FormField
          control={form.control}
          name="SizeId"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={t("Sizes")}
              placeholder="Select Size..."
              emptyBox="No size found"
              form={form}
              name="SizeId"
              items={sizes}
              selectText="Select Size"
            />
          )}
        />
        <FormField
          control={form.control}
          name="MeasurementName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter measurement name"}
              label={t("MeasurementName")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="MeasurementValue"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder="Enter measurement value"
              label={t("MeasurementValue")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="MeasurementUnit"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder="Enter measurement unite"
              label={t("MeasurementUnit")}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
