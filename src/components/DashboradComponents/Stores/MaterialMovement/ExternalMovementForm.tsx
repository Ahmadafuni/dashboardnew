import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { getAllChildMaterialNames } from "@/services/Materials.services";
import { getAllSupplierNames } from "@/services/Suppliers.services";
import { getAllWarehouseNames } from "@/services/Warehouse.services";
import { material } from "@/store/Material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ExternalMovementForm({ form, onSubmit }: Props) {
  const { t } = useTranslation();
  // Material
  const currentMaterial = useRecoilValue(material);
  // Child Material
  const [cMaterials, setCMaterials] = useState([]);
  // Warehouse
  const [warehouses, setWarehouses] = useState([]);
  // Supplier
  const [suppliers, setSuppliers] = useState([]);
  // Movement Types
  const movementTypesList = [
    { label: t("INCOMING"), value: "INCOMING" },
    { label: t("OUTGOING"), value: "OUTGOING" },
  ];
  // Page on load
  useEffect(() => {
    getAllWarehouseNames(setWarehouses);
    getAllSupplierNames(setSuppliers);
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
        id="external-movement"
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
          name="Supplier"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("Supplier")}
              placeholder="Select a warehouse"
              items={suppliers}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Warehouse"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("Warehouse")}
              placeholder="Select a warehouse"
              items={warehouses}
            />
          )}
        />
      </form>
    </Form>
  );
}
