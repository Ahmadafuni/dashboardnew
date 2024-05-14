import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { measurementSchema } from "@/form_schemas/newMeasurementSchema";
import { getAllSizesList } from "@/services/Sizes.service";
import { measurementsGroup } from "@/store/Measurement";
import { newMeasurementsNext } from "@/store/templateSize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { z } from "zod";
import {useTranslation} from "react-i18next";

export default function NewMeasurementForm() {
  // Sizes State
  const [sizes, setSizes] = useState<any[]>([]);
  const { t } = useTranslation();

  // Measurement Group
  // @ts-expect-error
  const [measurementsGroups, setMeasurementsGroups] =
    useRecoilState(measurementsGroup);
  const [measurements, setMeasurements] = useRecoilState(newMeasurementsNext);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      MeasurementName: "",
      MeasurementUnit: "",
      MeasurementValue: "",
      SizeId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof measurementSchema>) => {
    const uid = crypto.randomUUID();
    const newMap = new Map();
    [
      ...measurements,
      {
        ...data,
        Size: sizes.find((s) => s.value === data.SizeId).label,
        Id: uid,
      },
    ].forEach((item) => {
      const collection = newMap.get(item.Size);
      !collection ? newMap.set(item.Size, [item]) : collection.push(item);
    });
    setMeasurements((prev) => [
      ...prev,
      {
        ...data,
        Size: sizes.find((s) => s.value === data.SizeId).label,
        Id: uid,
      },
    ]);
    const temp_obj = {};
    // @ts-expect-error
    newMap.forEach((value, key) => (temp_obj[key] = value));
    setMeasurementsGroups(temp_obj);

    form.reset();
  };

  useEffect(() => {
    getAllSizesList(setSizes);
  }, []);
  return (
    <Card className="bg-[var(--card-background)]">
      <CardHeader>
        <h2 className="text-lg font-semibold">{t("Measurements")}</h2>
      </CardHeader>
      <CardContent className="space-y-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2"
            id="template-size"
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
        <div className="flex justify-end">
          <Button type="submit" form="template-size">
            {t("Add")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
