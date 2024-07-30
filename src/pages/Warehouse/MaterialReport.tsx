import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Form, FormField } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { materialList, material } from "@/store/Material";
import { childMaterialList } from "@/store/ChildMaterial";
import { getMaterialReportMovements } from "@/services/MaterialMovements.services";
import DataTable from "@/components/common/DataTable";
import { materialMovementList } from "@/store/MaterialMovement";
import { getAllMaterials, getMaterialById } from "@/services/Materials.services";


export default function MaterialReport() {
  const { t } = useTranslation();
  const form = useForm();
    const parentMaterialList = useRecoilValue(materialList);
    const cMaterialList = useRecoilValue(childMaterialList);
    const setCurrentMaterial = useSetRecoilState(material);
    const setMaterials = useSetRecoilState(materialList);
    const [materialMovements, setMaterialMovements] = useRecoilState(materialMovementList);

    const [selectedMaterial, setSelectedMaterial] = useState("");
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
  const [isParentMaterialEnabled, setParentMaterialEnabled] = useState(false);
  const [isChildMaterialEnabled, setChildMaterialEnabled] = useState(false);
  const [isMovementTypeEnabled, setMovementTypeEnabled] = useState(false);

  useEffect(() => {
    // @ts-ignore
    getAllMaterials(setMaterials);
  }, [setMaterials]);

  useEffect(() => {
    if (selectedMaterial) {
      getMaterialById(setCurrentMaterial, selectedMaterial);
    }
  }, [selectedMaterial, setCurrentMaterial]);

  const materialsOptions = parentMaterialList.map((material: any) => ({
    value: material.Id.toString(),
    label: material.Name.toString(),
  }));

  const materialsChildOptions = cMaterialList.map((childMaterial: any) => ({
    value: childMaterial.Id.toString(),
    label: childMaterial.Name.toString(),
  }));

  const onSubmit = async (data: any) => {
    try {
      const response = await getMaterialReportMovements(data);
      setMaterialMovements(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleReset = () => {
    form.reset();
    setMaterialMovements([]);
  };

  const handleCheckboxChange = (setter: any, name: string, resetValue: any) => {
    setter((prev: boolean) => {
      if (prev) {
        form.setValue(name, resetValue);
      }
      return !prev;
    });
  };


  const materialMovementsColumns = [
    { accessorKey: "invoiceNumber", header: t("Invoice Number") },
    { accessorKey: "movementType", header: t("Movement Type") },
    { accessorKey: "parentMaterialName", header: t("Parent Material Name") },
    { accessorKey: "childMaterialName", header: t("Child Material Name") },
    { accessorKey: "movedFrom", header: t("Moved From") },
    { accessorKey: "movedTo", header: t("Moved To") },
    { accessorKey: "quantity", header: t("Quantity") },
    { accessorKey: "unitOfQuantity", header: t("Unit Of Quantity") },
    { accessorKey: "movementDate", header: t("Date") },
    { accessorKey: "modelName", header: t("Model Name") },
    { accessorKey: "description", header: t("Description") },
  ];

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="bg-[var(--card-background)]">
            <CardHeader className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCardCollapsed(!isCardCollapsed)}
                className="ml-auto"
              >
                {isCardCollapsed ? <ChevronDown /> : <ChevronUp />}
              </Button>
            </CardHeader>
            {!isCardCollapsed && (
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="mt-8"
                    checked={isStartDateEnabled}
                                        onCheckedChange={() => handleCheckboxChange(setIsStartDateEnabled, "startDate", null)}
                  />
                  <FormField
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                      <DatePickerForForm
                        label={t("Start Date")}
                        field={field}
                        isDisabled={!isStartDateEnabled}
                        allowPastDates={true}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="mt-8"
                    checked={isEndDateEnabled}
                                        onCheckedChange={() => handleCheckboxChange(setIsEndDateEnabled, "endDate", null)}
                  />
                  <FormField
                    name="endDate"
                    control={form.control}
                    render={({ field }) => (
                      <DatePickerForForm
                        label={t("End Date")}
                        field={field}
                        isDisabled={!isEndDateEnabled}
                        allowPastDates={true}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="mt-8"
                    checked={isParentMaterialEnabled}
                                        onCheckedChange={() => handleCheckboxChange(setParentMaterialEnabled, "parentMaterialId", "")}
                  />
                  <FormField
                    name="parentMaterialId"
                    control={form.control}
                    render={({ field }) => (
                      <ComboSelectFieldForForm
                        field={field}
                        label={t("Parent Material ID")}
                        placeholder="search a material"
                        emptyBox={t("No material found")}
                        form={form}
                        name="parentMaterialId"
                        selectText={t("Select material")}
                        items={materialsOptions}
                        onChange={(value) => {
                          field.onChange(value);
                          setSelectedMaterial(value);
                        }}
                        disabled={!isParentMaterialEnabled}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="mt-8"
                    checked={isChildMaterialEnabled}
                                        onCheckedChange={() => handleCheckboxChange(setChildMaterialEnabled, "childMaterialId", "")}
                  />
                  <FormField
                    name="childMaterialId"
                    control={form.control}
                    render={({ field }) => (
                      <ComboSelectFieldForForm
                        field={field}
                        label={t("Child Material ID")}
                        placeholder="search a material"
                        emptyBox={t("No material found")}
                        form={form}
                        name="childMaterialId"
                        selectText={t("Select material")}
                        items={materialsChildOptions}
                        disabled={!isChildMaterialEnabled}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="mt-8"
                    checked={isMovementTypeEnabled}
                                        onCheckedChange={() => handleCheckboxChange(setMovementTypeEnabled, "movementType", "")}
                  />
                  <FormField
                    name="movementType"
                    control={form.control}
                    render={({ field }) => (
                      <SelectFieldForForm
                        field={field}
                        placeholder=""
                        label={t("Movement Type")}
                        items={[
                          { label: t("INCOMING"), value: "INCOMING" },
                          { label: t("OUTGOING"), value: "OUTGOING" },
                        ]}
                        disabled={!isMovementTypeEnabled}
                      />
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="submit">{t("Search")}</Button>
                                    <Button type="button" onClick={handleReset}>{t("Reset")}</Button>
                </div>
              </CardContent>
            )}
          </Card>
          <div className="flex justify-end mt-4 print:hidden">
            <Button onClick={() => window.print()}>{t("DownloadPDF")}</Button>
          </div>
        </form>
      </Form>
      <div id="datatable">
                <DataTable columns={materialMovementsColumns} data={materialMovements} />
      </div>
    </div>
  );
}
