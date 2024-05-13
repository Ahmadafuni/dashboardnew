import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { measurementSchema } from "@/form_schemas/newMeasurementSchema";
import { getAllSizesList } from "@/services/Sizes.service";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import {useTranslation} from "react-i18next";

interface Props {
  type: string;
  getMeasurements: any;
}
export default function NewMeasurementSingleForm({
  type,
  getMeasurements,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { templateId } = useParams();
  const { t } = useTranslation();
  // Sizes State
  const [sizes, setSizes] = useState<any[]>([]);

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
    setIsLoading(true);
    try {
      const newMsmt = await axios.post(
        "measurements/",
        { ...data, templateId: templateId, type: type },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newMsmt.data.message);
      form.reset();
      getMeasurements();
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllSizesList(setSizes);
  }, []);
  return (
    <Card className="bg-[var(--card-background)]">
      <CardHeader>
        <h2 className="text-lg font-semibold">Measurements</h2>
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
          <Button type="submit" form="template-size" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
                t("Add")
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
