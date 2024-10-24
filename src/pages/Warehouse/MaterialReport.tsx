import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Form, FormField } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { materialList, material } from "@/store/Material";
import { childMaterialList } from "@/store/ChildMaterial";
import { fetchMaterialConsumption, fetchMaterialConsumptionDepartment, getMaterialReportMovements } from "@/services/MaterialMovements.services";
import DataTable from "@/components/common/DataTable";
import { materialMovementList } from "@/store/MaterialMovement";
import { getAllMaterials, getMaterialById } from "@/services/Materials.services";
import { Button } from "@/components/ui/button";
import { getAllModel } from "@/services/Model.services";
import { getAllDepartmentList } from "@/services/Departments.services";
import { getAllWarehouseNames } from "@/services/Warehouse.services";
import { Shirt, LayoutPanelTop, ArrowRightLeft } from "lucide-react";

export default function MaterialReport() {
    const { t } = useTranslation();
    const form = useForm();
    const parentMaterialList = useRecoilValue(materialList);
    const cMaterialList = useRecoilValue(childMaterialList);
    const setCurrentMaterial = useSetRecoilState(material);
    const setMaterials = useSetRecoilState(materialList);
    const [materialMovements, setMaterialMovements] = useRecoilState(materialMovementList);


    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
    const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
    const [isParentMaterialEnabled, setParentMaterialEnabled] = useState(false);
    const [isChildMaterialEnabled, setChildMaterialEnabled] = useState(false);
    const [isMovementTypeEnabled, setMovementTypeEnabled] = useState(false);
    const [isWarehouseEnabled, setWarehouseEnabled] = useState(false);




    const [models, setModels] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [warehouse, setWarehouse] = useState([]);




    const [reportType, setReportType] = useState('movements');

    const [consumptionModelsData, setConsumptionModelsData] = useState<any>([]);
    const [consumptionDepartmentData, setConsumptionDepartmentData] = useState<any>([]);


    const [selectedModel, setSelectedModel] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');


    // @ts-ignore
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    // @ts-ignore
    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const fetchReportModel = () => {
        fetchMaterialConsumption(setConsumptionModelsData, Number(selectedModel));
    };

    const clearReportModel = () => {
        setConsumptionModelsData([]);
    };

    const fetchReportDepartment = () => {
        fetchMaterialConsumptionDepartment(setConsumptionDepartmentData, Number(selectedDepartment));
    };

    const clearReportDepartment = () => {
        setConsumptionDepartmentData([]);
    };

    useEffect(() => {

        getAllModel(setModels);
        getAllDepartmentList(setDepartments);
        getAllWarehouseNames(setWarehouse);

    }, []);

    useEffect(() => {

        // @ts-ignore
        getAllMaterials(setMaterials);

    }, [setMaterials]);

    useEffect(() => {
        if (selectedMaterial) {
            getMaterialById(setCurrentMaterial, selectedMaterial);
        }
    }, [selectedMaterial, setCurrentMaterial]);


    const warehouseOptions = warehouse.map((warehouse: any) => ({
        value: warehouse.value.toString(),
        label: warehouse.label.toString(),
    }));

    const materialsOptions = parentMaterialList.map((material: any) => ({
        value: material.Id.toString(),
        label: material.Name.toString(),
    }));

    const materialsChildOptions = cMaterialList.map((childMaterial: any) => ({
        value: childMaterial.Id.toString(),
        label: childMaterial.Name.toString(),
    }));

    const onSubmit = async (data: any) => {

        if (reportType === 'movements') {
            const response = await getMaterialReportMovements(data);
            setMaterialMovements(response.data);
            console.log(response.data);
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
        { accessorKey: "invoiceNumber", header: t("InvoiceNumber") },
        { accessorKey: "movementType", header: t("MovementType") },
        { accessorKey: "parentMaterialName", header: t("ParentMaterialName") },
        { accessorKey: "childMaterialName", header: t("ChildMaterialName") },
        { accessorKey: "movedFrom", header: t("MovedFrom") },
        { accessorKey: "movedTo", header: t("MovedTo") },
        { accessorKey: "quantity", header: t("Quantity") },
        { accessorKey: "unitOfQuantity", header: t("UnitOfQuantity") },
        { accessorKey: "movementDate", header: t("Date") },
        { accessorKey: "modelName", header: t("ModelName") },
        { accessorKey: "description", header: t("Description") },
    ];

    return (
        <div>
            <div className="flex justify-center mb-4">
                <div className="inline-flex bg-gray-200 p-2 rounded-full">
                    <Button
                        onClick={() => setReportType('movements')}
                        className={`${reportType === 'movements' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700'
                            } flex items-center px-6 py-3 rounded-full transition-colors`}
                    >
                        <ArrowRightLeft className="w-5 h-5 mr-2" /> {t("MaterialMovements")}
                    </Button>
                    <Button
                        onClick={() => setReportType('consumptionModels')}
                        className={`${reportType === 'consumptionModels' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700'
                            } flex items-center px-6 py-3 rounded-full transition-colors`}
                    >
                        <Shirt className="w-5 h-5 mr-2" /> {t("consumptionModels")}
                    </Button>
                    <Button
                        onClick={() => setReportType('consumptionDepartments')}
                        className={`${reportType === 'consumptionDepartments' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700'
                            } flex items-center px-6 py-3 rounded-full transition-colors`}
                    >
                        <LayoutPanelTop className="w-5 h-5 mr-2" /> {t("consumptionDepartments")}
                    </Button>
                </div>
            </div>




            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Card className="bg-[var(--card-background)] mb-10">
                        <CardHeader className="flex justify-between items-center">

                        </CardHeader>
                        {reportType === 'movements' && (
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
                                                label={t("StartDate")}
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
                                                label={t("EndDate")}
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
                                                label={t("ParentMaterialId")}
                                                placeholder={t("SearchMaterial")}
                                                emptyBox={t("NoMaterialFound")}
                                                form={form}
                                                name="parentMaterialId"
                                                selectText={t("SelectMaterial")}
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
                                                label={t("ChildMaterialId")}
                                                placeholder={t("SearchMaterial")}
                                                emptyBox={t("NoMaterialFound")}
                                                form={form}
                                                name="childMaterialId"
                                                selectText={t("SelectMaterial")}
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
                                                label={t("MovementType")}
                                                items={[
                                                    { label: t("INCOMING"), value: "INCOMING" },
                                                    { label: t("OUTGOING"), value: "OUTGOING" },
                                                ]}
                                                disabled={!isMovementTypeEnabled}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        className="mt-8"
                                        checked={isWarehouseEnabled}
                                        onCheckedChange={() => handleCheckboxChange(setWarehouseEnabled, "warehouseId", "")}
                                    />
                                    <FormField
                                        name="warehouseId"
                                        control={form.control}
                                        render={({ field }) => (
                                            <ComboSelectFieldForForm
                                                field={field}
                                                label={t("WarehouseId")}
                                                placeholder={t("SearchWarehouse")}
                                                emptyBox={t("NoWarehouseFound")}
                                                form={form}
                                                name="WarehouseId"
                                                selectText={t("SelectWarehouse")}
                                                items={warehouseOptions}
                                                disabled={!isWarehouseEnabled}
                                            />
                                        )}
                                    />
                                </div>


                                <div className="flex items-center space-x-2">
                                    <Button type="submit">{t("Search")}</Button>
                                    <Button type="button" onClick={handleReset}>{t("Reset")}</Button>
                                </div>
                            </CardContent>
                        )
                        }

                        {reportType === 'consumptionModels' && (
                            <CardContent className="grid grid-cols-1 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                                    {/* Select model */}
                                    <div className="flex flex-col md:w-1/2 space-y-2">
                                        <label htmlFor="model" className="font-semibold text-gray-700 dark:text-gray-200">Select a Model</label>
                                        <select
                                            id="model"
                                            name="model"
                                            className="form-select border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                                            onChange={handleModelChange} // قم بتعريف هذه الدالة لجلب الموديل المختار
                                        >
                                            <option value="" disabled selected>
                                                Choose a model
                                            </option>
                                            {models.map((model) => (
                                                // @ts-ignore
                                                <option key={model.Id} value={model.Id}>{model.ModelName} - {model.DemoModelNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Fetch report button */}
                                    <div className="flex justify-center md:w-auto space-x-2">

                                        <button
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white font-semibold py-2 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all duration-200 ease-in-out"
                                            onClick={fetchReportModel}
                                        >
                                            Fetch Report
                                        </button>


                                        <button
                                            className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 hover:from-red-600 hover:to-red-700 dark:hover:from-red-800 dark:hover:to-red-900 text-white font-semibold py-2 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-red-600 transition-all duration-200 ease-in-out"
                                            onClick={clearReportModel}
                                        >
                                            Clear
                                        </button>


                                    </div>
                                </div>
                            </CardContent>
                        )}

                        {reportType === 'consumptionDepartments' && (
                            <CardContent className="grid grid-cols-1 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                                    {/* Select department */}
                                    <div className="flex flex-col md:w-1/2 space-y-2">
                                        <label htmlFor="model" className="font-semibold text-gray-700 dark:text-gray-200">Select a Department</label>
                                        <select
                                            id="model"
                                            name="model"
                                            className="form-select border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                                            onChange={handleDepartmentChange}
                                        >
                                            <option value="" disabled selected>
                                                Choose a department
                                            </option>
                                            {departments.map((department) => (
                                                // @ts-ignore
                                                <option key={department.value} value={department.value}>{department.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Fetch report button */}
                                    <div className="flex justify-center md:w-auto space-x-2">
                                        <button
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white font-semibold py-2 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all duration-200 ease-in-out"
                                            onClick={fetchReportDepartment} // قم بتعريف هذه الدالة لجلب التقرير
                                        >
                                            Fetch Report
                                        </button>

                                        <button
                                            className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 hover:from-red-600 hover:to-red-700 dark:hover:from-red-800 dark:hover:to-red-900 text-white font-semibold py-2 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-red-600 transition-all duration-200 ease-in-out"
                                            onClick={clearReportDepartment}
                                        >
                                            Clear
                                        </button>

                                    </div>
                                </div>
                            </CardContent>
                        )}


                    </Card>
                    {/* <div className="flex justify-end mt-4 print:hidden">
                        <Button onClick={() => window.print()}>{t("DownloadPDF")}</Button>
                    </div> */}
                </form>
            </Form>

            {
                reportType === "movements" && (
                    <div id="datatable">
                        <DataTable columns={materialMovementsColumns} data={materialMovements} />
                    </div>
                )
            }
            {
                reportType === "consumptionModels" && (
                    consumptionModelsData && consumptionModelsData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                            {consumptionModelsData.map((item: any) => (
                                <Card
                                    key={item.material.Id}
                                    className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                                >
                                    <h3 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4">
                                        {item.material.Name}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-3 overflow-auto max-h-80">
                                        {/* عرض بيانات الوحدة والاستهلاك في شبكة مع تمرير */}
                                        {item.units.map((unit: any, index: number) => (
                                            <div key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-md px-2 py-1">
                                                        {t("Unit")}:
                                                    </span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{unit.unit}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900 dark:text-white">{t("Incoming")}:</span>
                                                    <span>{unit.incoming}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900 dark:text-white">{t("Outgoing")}:</span>
                                                    <span>{unit.outgoing}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900 dark:text-white">{t("Consumption")}:</span>
                                                    <span>{unit.consumption}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-10">
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6" />
                            </svg>
                            <p className="text-xl text-gray-700 dark:text-gray-200">{t("No Results Found")}</p>
                            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">{t("Try adjusting your filters or data")}</p>
                        </div>
                    )
                )
            }
            {
                reportType === "consumptionDepartments" && (
                    consumptionDepartmentData && consumptionDepartmentData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                            {consumptionDepartmentData.map((item: any) => (
                                <Card
                                    key={item.material.Id}
                                    className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                                >
                                    <h3 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4">
                                        {item.material.Name}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-3 overflow-auto max-h-80">
                                        {/* عرض بيانات الوحدة والاستهلاك في شبكة مع تمرير */}
                                        {item.units.map((unit: any, index: number) => (
                                            <div key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-md px-2 py-1">
                                                        {t("Unit")}:
                                                    </span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{unit.unit}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900 dark:text-white">{t("Incoming")}:</span>
                                                    <span>{unit.incoming}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900 dark:text-white">{t("Outgoing")}:</span>
                                                    <span>{unit.outgoing}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900 dark:text-white">{t("Consumption")}:</span>
                                                    <span>{unit.consumption}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-10">
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6" />
                            </svg>
                            <p className="text-xl text-gray-700 dark:text-gray-200">{t("No Results Found")}</p>
                            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">{t("Try adjusting your filters or data")}</p>
                        </div>
                    )
                )
            }


        </div>
    );
}
