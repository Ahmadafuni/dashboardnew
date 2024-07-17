import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { getAllDepartmentList } from "@/services/Departments.services";
import { getAllChildMaterialNames } from "@/services/Materials.services";
import { getAllWarehouseNames } from "@/services/Warehouse.services";
import { getAllSupplierNames } from "@/services/Suppliers.services";
import { material } from "@/store/Material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";

interface Props {
    form: any;
    onSubmit: any;
}

export default function IncomingMovementForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();

    // Main Information Group
    //const movementType = "INCOMING";
    const movementFromOptions = [
        { label: t("Department"), value: "Department" },
        { label: t("Warehouse"), value: "Warehouse" },
        { label: t("Supplier"), value: "Supplier" },
    ];
    const movementToOptions = [{ label: t("Warehouse"), value: "Warehouse" }];

    // First and second sides in Incoming Movement
    const [departments, setDepartments] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [selectedMovementFrom, setSelectedMovementFrom] = useState("");
    const [selectedMovementTo, setSelectedMovementTo] = useState("");

    // Materials Part

    const currentMaterial = useRecoilValue(material);
    const [cMaterials, setCMaterials] = useState([]);


    // Page on load
    useEffect(() => {
        getAllDepartmentList(setDepartments);
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
                className="space-y-4"
                id="incoming-movement"
            >
                {/* Main Information Card */}
                <Card className="bg-[var(--card-background)]">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t("MainInformations")}</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="movementFromOptions"
                                render={({ field }) => (
                                    <SelectFieldForForm
                                        field={field}
                                        label={t("MovementFrom")}
                                        placeholder="Select first movement side"
                                        items={movementFromOptions}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            setSelectedMovementFrom(value);
                                        }}
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="movementToOptions"
                                render={({ field }) => (
                                    <SelectFieldForForm
                                        field={field}
                                        label={t("MovementTo")}
                                        placeholder="Select second movement side"
                                        items={movementToOptions}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            setSelectedMovementTo(value);
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedMovementFrom === "Department" && (
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
                            )}

                            {selectedMovementFrom === "Warehouse" && (
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
                            )}

                            {selectedMovementFrom === "Supplier" && (
                                <FormField
                                    control={form.control}
                                    name="SupplierFrom"
                                    render={({ field }) => (
                                        <SelectFieldForForm
                                            field={field}
                                            label={t("SupplierFrom")}
                                            placeholder="Select a supplier"
                                            items={suppliers}
                                        />
                                    )}
                                />
                            )}

                            {selectedMovementTo === "Warehouse" && (
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
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Material Information Card */}
                <Card className="bg-[var(--card-background)]">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t("MaterialInformations")}</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
