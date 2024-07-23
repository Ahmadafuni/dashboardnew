import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Form, FormField } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAllDepartmentList } from "@/services/Departments.services";
import { getAllMaterials, getChildMaterialByParentId, getMaterialById } from "@/services/Materials.services";
import { getAllWarehouseNames } from "@/services/Warehouse.services";
import { getAllSupplierNames } from "@/services/Suppliers.services";
import { getAllModel } from "@/services/Model.services";
import { material, materialId, materialList } from "@/store/Material";
import { departmentList } from "@/store/Department";
import { warehouseList } from "@/store/Warehouse";
import { supplierList } from "@/store/Supplier";
import { childMaterialList, newChildMaterialModal } from "@/store/ChildMaterial";
import { modelList } from "@/store/Models";
import NewChildMaterial from "@/components/DashboradComponents/Warehouse/ChildMaterials/NewChildMaterial";

interface Props {
    form: any;
    onSubmit: any;
    movementFromOptions: any[];
    movementToOptions: any[];
}

export default function MovementForm({ form, onSubmit, movementFromOptions, movementToOptions }: Props) {
    const { t } = useTranslation();

    // Use Recoil state
    const departments = useRecoilValue(departmentList);
    const warehouses = useRecoilValue(warehouseList);
    const suppliers = useRecoilValue(supplierList);
    const parentMaterialList = useRecoilValue(materialList);
    const currentMaterial = useRecoilValue(material);
    const cMaterialList = useRecoilValue(childMaterialList);
    const modelsList = useRecoilValue(modelList);

    const setDepartments = useSetRecoilState(departmentList);
    const setWarehouses = useSetRecoilState(warehouseList);
    const setSuppliers = useSetRecoilState(supplierList);
    const setMaterials = useSetRecoilState(materialList);
    const setChildMaterials = useSetRecoilState(childMaterialList);
    const setCurrentMaterial = useSetRecoilState(material);
    const setModels = useSetRecoilState(modelList);
    const setMaterialId = useSetRecoilState(materialId);
    const setNewChildMaterialModal = useSetRecoilState(newChildMaterialModal);

    const [selectedMovementFrom, setSelectedMovementFrom] = useState("");
    const [selectedMovementTo, setSelectedMovementTo] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");

    // Page on load
    useEffect(() => {
        getAllDepartmentList(setDepartments);
        getAllWarehouseNames(setWarehouses);
        getAllSupplierNames(setSuppliers);
        // @ts-ignore
        getAllMaterials(setMaterials);
    }, [setDepartments, setWarehouses, setSuppliers, setMaterials]);

    useEffect(() => {
        if (selectedMaterial) {
            getMaterialById(setCurrentMaterial, selectedMaterial);
        }
    }, [selectedMaterial, setCurrentMaterial]);

    useEffect(() => {
        if (selectedMaterial && currentMaterial.hasChildren) {
            // @ts-ignore
            getChildMaterialByParentId(setChildMaterials, selectedMaterial);
        }
        if (selectedMaterial && currentMaterial.isRelevantToProduction) {
            getAllModel(setModels);
        }
    }, [selectedMaterial, currentMaterial, setChildMaterials, setModels]);

    const materialsOptions = parentMaterialList.map((material: any) => ({
        value: material.Id.toString(),
        label: material.Name.toString(),
    }));

    const materialsChildOptions = cMaterialList.map((childMaterial: any) => ({
        value: childMaterial.Id.toString(),
        label: childMaterial.Name.toString(),
    }));

    const modelsOptions = modelsList.map((model: any) => ({
        value: model?.Id?.toString() || "",
        label: model?.ModelName?.toString() || "",
    }));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="incoming-movement">
                {/* @ts-ignore */}
                <NewChildMaterial getChildMaterialByParentId={() => getChildMaterialByParentId(setChildMaterials, selectedMaterial)} />
                {/* Main Information Card */}
                <Card className="bg-[var(--card-background)]">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t("MainInformations")}</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <FormField
                                control={form.control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <TextInputFieldForForm placeholder="" label={t("InvoiceNumber")} field={field} />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="movementDate"
                                render={({ field }) => (
                                    <DatePickerForForm label={t("MovementDate")} field={field} />
                                )}
                            />
                        </div>
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
                                    name="departmentFromId"
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
                                    name="warehouseFromId"
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
                            {(selectedMovementFrom === "Supplier" || selectedMovementTo === "Supplier") && (
                                <FormField
                                    control={form.control}
                                    name="supplierId"
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
                                    name="warehouseToId"
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
                    <CardContent className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="parentMaterialId"
                            render={({ field }) => (
                                <div className="flex gap-x-1">
                                    <ComboSelectFieldForForm
                                        field={field}
                                        label={t("Material")}
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
                                    />
                                </div>
                            )}
                        />
                        {currentMaterial.hasChildren && (
                            <FormField
                                control={form.control}
                                name="childMaterialId"
                                render={({ field }) => (
                                    <div className="flex gap-x-1">
                                        <ComboSelectFieldForForm
                                            field={field}
                                            label={t("ChildMaterial")}
                                            placeholder="Select a child material"
                                            items={materialsChildOptions}
                                            form={form}
                                            emptyBox={t("No options")}
                                            name="childMaterialId"
                                            selectText={t("Select an option")}
                                        />
                                        <Button
                                            variant="outline"
                                            className="mt-8"
                                            type="button"
                                            onClick={() => {
                                                const materialId = parseInt(selectedMaterial, 10);
                                                setMaterialId(materialId);
                                                setNewChildMaterialModal(true);
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <TextInputFieldForForm placeholder="" label={t("Quantity")} field={field}/>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unitOfQuantity"
                            render={({ field }) => (
                                <TextInputFieldForForm placeholder="" label={t("UnitOfQuantity")} field={field} />
                            )}
                        />
                        {currentMaterial.isRelevantToProduction && (
                            <FormField
                                control={form.control}
                                name="modelId"
                                render={({ field }) => (
                                    <div className="flex gap-x-1">
                                        <ComboSelectFieldForForm
                                            field={field}
                                            label={t("Model")}
                                            placeholder="Select a Model"
                                            items={modelsOptions}
                                            form={form}
                                            emptyBox={t("No options")}
                                            name="modelId"
                                            selectText={t("Select an option")}
                                        />
                                    </div>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <TextInputFieldForForm placeholder="" label={t("Description")} field={field} />
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
