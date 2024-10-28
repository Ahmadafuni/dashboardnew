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
import LoadingDialog from "@/components/ui/LoadingDialog";
import { toast } from "sonner";

export default function MaterialReport() {
    const { t } = useTranslation();
    const form = useForm();
    const parentMaterialList = useRecoilValue(materialList);
    const cMaterialList = useRecoilValue(childMaterialList);
    const setCurrentMaterial = useSetRecoilState(material);
    const setMaterials = useSetRecoilState(materialList);
    const [materialMovements, setMaterialMovements] = useRecoilState(materialMovementList);

    const [isLoading, setIsLoading] = useState(false);


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


    const handleModelChange = (value:any) => {
        setSelectedModel(value);
    };

    const handleDepartmentChange = (value:any) => {
        setSelectedDepartment(value);
    };

    const fetchReportModel = () => {
        if(selectedModel != '')
        fetchMaterialConsumption(setConsumptionModelsData, Number(selectedModel) , setIsLoading);
        else 
         toast.warning(t("ChooseaModelFirst"))
    };

    const clearReportModel = () => {
        setConsumptionModelsData([]);
    };

    const fetchReportDepartment = () => {
        if(selectedDepartment != '')
            fetchMaterialConsumptionDepartment(setConsumptionDepartmentData, Number(selectedDepartment) , setIsLoading);
        else 
        toast.warning(t("ChooseaDepartmentFirst"))

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
            const response = await getMaterialReportMovements(data , setIsLoading);
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

        {isLoading && 
                    <LoadingDialog 
                    isOpen={isLoading} 
                    message="Loading..." 
                    subMessage="Please wait, your request is being processed now." 
                />}

        <div className="flex justify-center mb-6">
            <div className="inline-flex p-2 rounded-full space-x-2 bg-gray-100 dark:bg-gray-800 shadow-md transition-colors">
                <Button
                    onClick={() => setReportType('movements')}
                    className={`${
                        reportType === 'movements'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    } flex items-center px-6 py-3 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-400 dark:hover:bg-blue-600 hover:shadow-md`}
                >
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                 {t("MaterialMovements")}
                </Button>
                
                <Button
                    onClick={() => setReportType('consumptionModels')}
                    className={`${
                        reportType === 'consumptionModels'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    } flex items-center px-6 py-3 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-400 dark:hover:bg-blue-600 hover:shadow-md`}
                >
                <Shirt className="w-5 h-5 mr-2" />
                    {t("consumptionModels")}
                </Button>
                
                <Button
                    onClick={() => setReportType('consumptionDepartments')}
                    className={`${
                        reportType === 'consumptionDepartments'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    } flex items-center px-6 py-3 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-400 dark:hover:bg-blue-600 hover:shadow-md`}
                >
                <LayoutPanelTop className="w-5 h-5 mr-2" />
                    {t("consumptionDepartments")}
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
                            <CardContent className="grid grid-cols-1 gap-4 p-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out">
                                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
                                <div className="flex flex-col md:w-1/2 space-y-3">
                                   
                                    <FormField
                                        name="model"
                                        control={form.control}
                                        render={({ field }) => (
                                            <ComboSelectFieldForForm
                                                field={field}
                                                label={t("SelectaModel")}
                                                placeholder={t("ChooseAModel")}
                                                emptyBox={t("NoModelFound")}
                                                form={form}
                                                name="model"
                                                selectText={t("SelectModel")}
                                                items={models.map((model) => ({
                                                    // @ts-ignore
                                                    label: `${model.ModelName} - ${model.DemoModelNumber}`,value: model.Id
                                                }))}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    handleModelChange(value);
                                                }}
                                            />
                                        )}
                                    />

                                </div>

                                <div className="flex justify-center md:w-auto space-x-3">
                                    <Button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold py-2 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all duration-200 ease-in-out"
                                    onClick={fetchReportModel}
                                    >
                                    {t("FetchReport")}
                                    </Button>
                                    <Button
                                    className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-semibold py-2 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 dark:focus:ring-red-600 transition-all duration-200 ease-in-out"
                                    onClick={clearReportModel}
                                    >
                                    {t("Clear")}
                                    </Button>
                                </div>
                                </div>
                            </CardContent>
                        )}

                        {reportType === 'consumptionDepartments' && (
                            <CardContent className="grid grid-cols-1 gap-4 p-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out">
                                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
                                <div className="flex flex-col md:w-1/2 space-y-3">
                                   
                                    <FormField
                                        name="department"
                                        control={form.control}
                                        render={({ field }) => (
                                            <ComboSelectFieldForForm
                                                field={field}
                                                label={t("SelectaDepartment")}
                                                placeholder={t("ChooseAdepartment")}
                                                emptyBox={t("NoDepartmentFound")}
                                                form={form}
                                                name="department"
                                                selectText={t("SelectDepartment")}
                                                items={departments.map((department) => ({
                                                    // @ts-ignore
                                                    label: department.label,value: department.value,
                                                }))}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    handleDepartmentChange(value); 
                                                }}
                                            />
                                        )}
                                    />

                                </div>

                                <div className="flex justify-center md:w-auto space-x-3">
                                    <Button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold py-2 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all duration-200 ease-in-out"
                                    onClick={fetchReportDepartment}
                                    >
                                    {t("FetchReport")}
                                    </Button>
                                    <Button
                                    className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-semibold py-2 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 dark:focus:ring-red-600 transition-all duration-200 ease-in-out"
                                    onClick={clearReportDepartment}
                                    >
                                    {t("Clear")}
                                    </Button>
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
                            <p className="text-xl text-gray-700 dark:text-gray-200">{t("NoResultsFound")}</p>
                            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">{t("TryAgainForOtherModels")}</p>
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
                            <p className="text-xl text-gray-700 dark:text-gray-200">{t("NoResultsFound")}</p>
                            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">{t("TryAgainForOtherDepartments")}</p>
                        </div>
                    )
                )
            }

        </div>
    );
}
