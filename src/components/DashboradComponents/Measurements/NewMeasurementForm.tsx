// @ts-nocheck

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {FileDown, Eraser} from "lucide-react";

export default function NewMeasurementForm() {
  // Sizes State
  const [sizes, setSizes] = useState<any[]>([]);
  const { t } = useTranslation();

  // Measurement Group
  const [measurementsGroups, setMeasurementsGroups] =
      useRecoilState(measurementsGroup);
  const [measurements, setMeasurements] = useRecoilState(newMeasurementsNext);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      MeasurementName: "",
      MeasurementUnit: "cm",
      MeasurementValue: "",
      SizeId: "",
    },
  });

  // Load sizes on component mount
  useEffect(() => {
    getAllSizesList(setSizes);
  }, []);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Validate file type
    const validFileTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (!validFileTypes.includes(file.type)) {
      alert(t("InvalidFileType"));
      return;
    }

    // Validate file size (limit: 5 MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      alert(t("FileSizeExceeded"));
      return;
    }

    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      // Validate Excel structure
      if (worksheet.length < 5) {
        alert(t("InsufficientRows"));
        return;
      }

      const headers = worksheet[4]; // Headers with sizes (row 5)
      if (!headers || headers.length < 2) {
        alert(t("IncorrectStructure"));
        return;
      }

      const rows = worksheet.slice(5); // Data rows with MeasurementName and values (from row 6 onwards)

      const newMeasurements = [];
      const missingSizes = new Set(); // To track sizes that are not found in the droplist

      rows.forEach((row) => {
        const measurementName = row[0]; // First column: MeasurementName
        if (!measurementName) {
          // Skip if MeasurementName is empty
          return;
        }

        // Iterate through each size column (from index 1 onwards)
        headers.slice(1).forEach((sizeLabel, colIndex) => {
          const size = sizes.find((s) => s.label === sizeLabel.toString());
          if (!size) {
            // Track missing sizes
            missingSizes.add(sizeLabel);
            return;
          }

          const measurementValue = row[colIndex + 1];
          if (measurementValue !== undefined && measurementValue !== null) {
            const uid = crypto.randomUUID();
            const newMeasurement = {
              SizeId: size.value.toString(),  // Ensure SizeId is a string
              MeasurementName: measurementName.toString(),  // Ensure it's a string
              MeasurementValue: measurementValue.toString(),  // Ensure it's a string
              MeasurementUnit: "cm",
              Size: size.label,
              Id: uid.toString(),  // Ensure Id is a string
            };

            newMeasurements.push(newMeasurement);
          }
        });
      });

      if (missingSizes.size > 0) {
        // Create a message listing all missing sizes
        const missingSizesMessage = t("MissingSizes", { sizes: Array.from(missingSizes).join(", ") });
        alert(missingSizesMessage);
        return;
      }

      if (newMeasurements.length > 0) {
        // Update the form state with the first entry to display it in the form
        form.setValue("SizeId", newMeasurements[0].SizeId);
        form.setValue("MeasurementName", newMeasurements[0].MeasurementName);
        form.setValue("MeasurementValue", newMeasurements[0].MeasurementValue);
        form.setValue("MeasurementUnit", "cm");

        // Update the measurements state
        setMeasurements((prev) => [...prev, ...newMeasurements]);

        // Update measurementsGroups state
        const newMap = new Map();
        [...measurements, ...newMeasurements].forEach((item) => {
          const collection = newMap.get(item.Size);
          !collection ? newMap.set(item.Size, [item]) : collection.push(item);
        });
        const temp_obj = {};
        newMap.forEach((value, key) => (temp_obj[key] = value));
        setMeasurementsGroups(temp_obj);
      } else {
        alert(t("NoValidMeasurements"));
      }
    }
  };

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
                          placeholder="Enter measurement unit"
                          label={t("MeasurementUnit")}
                          field={field}
                          defaultValue="cm" // Always set to cm
                      />
                  )}
              />
            </form>
          </Form>
          <div className="flex justify-end space-x-2 mt-4">
            <input
                type="file"
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                id="import-excel"
            />
            <Button
                className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                onClick={() => {
                  form.reset(); // Clear the form
                  setMeasurements([]); // Clear measurements state
                  setMeasurementsGroups({}); // Clear measurements group state
                }}
            >
              <Eraser className="mr-2 h-4 w-4" />
            </Button>
            <Button
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                onClick={() => document.getElementById('import-excel').click()}
            >
              <FileDown className="mr-2 h-4 w-4" />
            </Button>

            <Button type="submit" form="template-size">
              {t("Add")}
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
