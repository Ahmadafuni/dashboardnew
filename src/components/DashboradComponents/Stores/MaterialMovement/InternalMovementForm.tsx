import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { getAllDepartmentList } from "@/services/Departments.services";
import { getAllChildMaterialNames } from "@/services/Materials.services";
import { getAllWarehouseNames } from "@/services/Warehouse.services";
import { material } from "@/store/Material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
}

export default function InternalMovementForm({ form, onSubmit }: Props) {
  const { t } = useTranslation();
  // Material
  const currentMaterial = useRecoilValue(material);
  // Child Material
  const [cMaterials, setCMaterials] = useState([]);
  // Departments
  const [departments, setDepartments] = useState([]);
  // Warehouse
  const [warehouses, setWarehouses] = useState([]);
  // Movement Types
  const movementTypesList = [
    { label: t("INCOMING"), value: "INCOMING" },
    { label: t("OUTGOING"), value: "OUTGOING" },
  ];
  // Page on load
  useEffect(() => {
    getAllDepartmentList(setDepartments);
    getAllWarehouseNames(setWarehouses);
  }, []);
  useEffect(() => {
    if (currentMaterial.hasChildren)
      getAllChildMaterialNames(setCMaterials, currentMaterial.id);
  }, [currentMaterial]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
        id="internal-movement"
      >
        <FormField
          control={form.control}
          name="MovementType"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("MovementType")}
              placeholder="Select movement type"
              items={movementTypesList}
            />
          )}
        />
        {currentMaterial.hasChildren && (
          <FormField
            control={form.control}
            name="ChildMaterial"
            render={({ field }) => (
              <SelectFieldForForm
                field={field}
                label={t("ChildMaterial")}
                placeholder="Select a child material"
                items={cMaterials}
              />
            )}
          />
        )}
        <FormField
          control={form.control}
          name="Quantity"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Quantity")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="UnitOfQuantity"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("UnitOfQuantity")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="MovementDate"
          render={({ field }) => (
            <DatePickerForForm label={t("MovementDate")} field={field} />
          )}
        />
        <FormField
          control={form.control}
          name="DepartmentFrom"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("DepartmentFrom")}
              placeholder="Select a department"
              items={departments}
            />
          )}
        />
        <FormField
          control={form.control}
          name="WarehouseFrom"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("WarehouseFrom")}
              placeholder="Select a warehouse"
              items={warehouses}
            />
          )}
        />
        <FormField
          control={form.control}
          name="DepartmentTo"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("DepartmentTo")}
              placeholder="Select a department"
              items={departments}
            />
          )}
        />
        <FormField
          control={form.control}
          name="WarehouseTo"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("WarehouseTo")}
              placeholder="Select a warehouse"
              items={warehouses}
            />
          )}
        />
      </form>
    </Form>
  );
}
