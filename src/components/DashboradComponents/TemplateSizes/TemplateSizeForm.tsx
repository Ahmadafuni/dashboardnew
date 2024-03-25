import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { sizeList } from "@/store/Sizes.ts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {useState} from "react";
import {MinusCircleIcon, PlusCircleIcon} from "lucide-react";

interface Props {
    form: any;
    onSubmit: any;
}
interface Measurement {
    name: string;
    value: string;
    unit: string;
}


export default function TemplateSizeForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();
    const sizesList = useRecoilValue(sizeList);
    const [measurementName, setMeasurementName] = useState("");
    const [measurementValue, setMeasurementValue] = useState("");
    const [measurementUnit, setMeasurementUnit] = useState("");
    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    const handleAddMeasurement = () => {
        setMeasurements([...measurements, { name: measurementName, value: measurementValue, unit: measurementUnit }]);
        setMeasurementName("");
        setMeasurementValue("");
        setMeasurementUnit("");
    };
    const handleDeleteMeasurement = (index: number) => {
        const updatedMeasurements = [...measurements];
        updatedMeasurements.splice(index, 1);
        setMeasurements(updatedMeasurements);
    };

    return (
        <Form {...form}>
            <Card style={{ backgroundColor: "var(--card-background)" }}>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Size Type</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="templateSizeType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <div className="flex space-x-2">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="CUTTING"
                                                id="cutting"
                                            />
                                            <label htmlFor="cutting">CUTTING Type</label>
                                            <input
                                                type="radio"
                                                {...field}
                                                value="DRESSUP"
                                                id="dressup"
                                            />
                                            <label htmlFor="dressup">DRESSUP Type</label>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </form>
                </CardContent>
            </Card>

            <Card style={{ backgroundColor: "var(--card-background)" }}>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Information</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <TextInputFieldForForm
                                    placeholder="Enter template name"
                                    label={t("Name")}
                                    field={field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="SizeId"
                            render={({ field }) => (
                                <ComboSelectFieldForForm
                                    field={field}
                                    label="Size"
                                    placeholder="Select size"
                                    emptyBox="No size found"
                                    form={form}
                                    name="SizeId"
                                    items={sizesList}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <TextInputFieldForForm
                                    placeholder="Enter description"
                                    label={t("Description")}
                                    field={field}
                                />
                            )}
                        />
                    </form>
                </CardContent>
            </Card>

            <Card style={{ backgroundColor: "var(--card-background)" }}>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Measurements</h2>
                </CardHeader>
                <CardContent>
                    {/* Measurements form fields go here */}




                    <div className="flex flex-col space-y-2" >
                        {measurements.map((measurement, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={measurement.name}
                                    className="form-input w-1/3 bg-gray-800 text-gray-100 border-gray-700 rounded-md px-3 py-2"
                                />
                                <input
                                    type="text"
                                    value={measurement.value}
                                    className="form-input w-1/3 bg-gray-800 text-gray-100 border-gray-700 rounded-md px-3 py-2"
                                />
                                <input
                                    type="text"
                                    value={measurement.unit}
                                    className="form-input w-1/3 bg-gray-800 text-gray-100 border-gray-700 rounded-md px-3 py-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteMeasurement(index)}
                                    className="focus:outline-none"
                                >
                                    <MinusCircleIcon className="h-6 w-6 text-red-500 cursor-pointer" />
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Measurement Name"
                                value={measurementName}
                                onChange={(e) => setMeasurementName(e.target.value)}
                                className="form-input w-1/3 bg-gray-800 text-gray-100 border-gray-700 rounded-md px-3 py-2"
                            />

                            <input
                                type="text"
                                placeholder="Value"
                                value={measurementValue}
                                onChange={(e) => setMeasurementValue(e.target.value)}
                                className="form-input w-1/3 bg-gray-800 text-gray-100 border-gray-700 rounded-md px-3 py-2"
                            />
                            <input
                                type="text"
                                placeholder="Unit"
                                value={measurementUnit}
                                onChange={(e) => setMeasurementUnit(e.target.value)}
                                className="form-input w-1/3 bg-gray-800 text-gray-100 border-gray-700 rounded-md px-3 py-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddMeasurement}
                                className="focus:outline-none"
                            >
                                <PlusCircleIcon />
                            </button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </Form>
    );
}
