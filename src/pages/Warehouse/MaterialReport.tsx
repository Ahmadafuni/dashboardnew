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
import { getMaterialReportMovements } from "@/services/MaterialMovements.services";
import DataTable from "@/components/common/DataTable";
import { materialMovementList } from "@/store/MaterialMovement";
import { getAllMaterials, getMaterialById } from "@/services/Materials.services";
import { Button } from "@/components/ui/button";

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



    const [reportType, setReportType] = useState('movements');

    const [consumptionData, setConsumptionData] = useState<any>([]); // لتخزين بيانات الاستهلاك

    

    const [selectedModel, setSelectedModel] = useState('');

    // @ts-ignore
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const fetchReport = () => {
        // استدعاء API أو أي كود لجلب التقرير بناءً على selectedModel
        console.log(`Fetching report for model: ${selectedModel}`);
    };


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

    const onSubmit = async (data : any) => {
        // استنادًا إلى نوع التقرير، قم بعملية معينة
        if (reportType === 'movements') {
            const response = await getMaterialReportMovements(data);
            setMaterialMovements(response.data);
        } else if (reportType === 'consumptionModels') {
            //const response = await getMaterialConsumption(data);
            
            const dataTest = [
                {
                    "materialId" : 1 ,
                    "materialName" : "material_1" ,
                    "quantityUsed" : "12%" ,
                    "totalConsumption" : "123" ,
                    "lastUsedDate" : "2024/10/23" ,
                },
                {
                    "materialId" : 2 ,
                    "materialName" : "material_2" ,
                    "quantityUsed" : "12%" ,
                    "totalConsumption" : "123" ,
                    "lastUsedDate" : "2024/10/23" ,
                },
                {
                    "materialId" : 3 ,
                    "materialName" : "material_3" ,
                    "quantityUsed" : "12%" ,
                    "totalConsumption" : "123" ,
                    "lastUsedDate" : "2024/10/23" ,
                },

            ] ;
            setConsumptionData(dataTest);
        }
        // أضف المزيد من أنواع التقارير حسب الحاجة
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
            <div className="flex space-x-4 mb-4">
                <Button
                    variant={reportType === 'movements' ? 'secondary' : 'default'}
                    onClick={() => setReportType('movements')}
                >
                    {t("MaterialMovements")}
                </Button>
                <Button
                    variant={reportType === 'consumptionModels' ? 'secondary' : 'default'}
                    onClick={() => setReportType('consumptionModels')}
                >
                    {t("consumptionModels")}
                </Button>
                {/* أضف المزيد من الأزرار حسب الحاجة */}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Card className="bg-[var(--card-background)]">
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
                                <div className="flex justify-end space-x-2 mt-4">
                                    <Button type="submit">{t("Search")}</Button>
                                    <Button type="button" onClick={handleReset}>{t("Reset")}</Button>
                                </div>
                            </CardContent>
                            )
                        }

                        {reportType === 'consumptionModels' && (
                           <CardContent className="grid grid-cols-1 gap-4 p-4">
                           <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                               {/* Select model */}
                               <div className="flex flex-col md:w-1/2 space-y-2">
                                   <label htmlFor="model" className="font-semibold text-gray-700">Select a Model</label>
                                   <select
                                       id="model"
                                       name="model"
                                       className="form-select border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                                       onChange={handleModelChange} // قم بتعريف هذه الدالة لجلب الموديل المختار
                                   >
                                       <option value="" disabled selected>
                                           Choose a model
                                       </option>
                                       {/* {models.map((model) => (
                                           <option key={model.id} value={model.id}>
                                               {model.name}
                                           </option>
                                       ))} */}
                                   </select>
                               </div>
                       
                               {/* Fetch report button */}
                               <div className="flex justify-center md:w-auto">
                                   <button
                                       className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200 ease-in-out"
                                       onClick={fetchReport} // قم بتعريف هذه الدالة لجلب التقرير
                                   >
                                       Fetch Report
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
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                        {[
                                    {
                                        "materialId" : 1 ,
                                        "materialName" : "material_1" ,
                                        "quantityUsed" : "12%" ,
                                        "totalConsumption" : "123" ,
                                        "lastUsedDate" : "2024/10/23" ,
                                    },
                                    {
                                        "materialId" : 2 ,
                                        "materialName" : "material_2" ,
                                        "quantityUsed" : "12%" ,
                                        "totalConsumption" : "123" ,
                                        "lastUsedDate" : "2024/10/23" ,
                                    },
                                    {
                                        "materialId" : 3 ,
                                        "materialName" : "material_3" ,
                                        "quantityUsed" : "12%" ,
                                        "totalConsumption" : "123" ,
                                        "lastUsedDate" : "2024/10/23" ,
                                    },
                                    {
                                        "materialId" : 4 ,
                                        "materialName" : "material_3" ,
                                        "quantityUsed" : "12%" ,
                                        "totalConsumption" : "123" ,
                                        "lastUsedDate" : "2024/10/23" ,
                                    },

                                ].map((item:any) => (
                                    <Card
                                        key={item.materialId}
                                        className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                                        >
                                        <h3 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4">
                                            {item.materialName}
                                        </h3>
                                        <div className="space-y-3">
                                            <p className="text-lg text-gray-700 dark:text-gray-200">
                                            {t("QuantityUsed")}: <span className="font-medium text-gray-900 dark:text-white">{item.quantityUsed}</span>
                                            </p>
                                            <p className="text-lg text-gray-700 dark:text-gray-200">
                                            {t("TotalConsumption")}: <span className="font-medium text-gray-900 dark:text-white">{item.totalConsumption}</span>
                                            </p>
                                            <p className="text-lg text-gray-700 dark:text-gray-200">
                                            {t("LastUsedDate")}: <span className="font-medium text-gray-900 dark:text-white">{item.lastUsedDate}</span>
                                            </p>
                                        </div>
                                    </Card>

                                  
                                ))}
                   </div>
                )
            } 




        </div>
    );
}
