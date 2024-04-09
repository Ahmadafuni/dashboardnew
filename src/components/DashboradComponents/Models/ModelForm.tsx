import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { newTextileModal, textileList } from "@/store/Textiles.ts";
import {newProductCategoryOneModal, productCategoryOneList} from "@/store/ProductCategoryOne.ts";
import {newProductCategoryTwoModal, productCategoryTwoList} from "@/store/ProductCategoryTwo.ts";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {newOrderModal, orderList} from "@/store/Orders.ts";
import SelectFieldForForm from "@/components/common/SelectFieldForForm.tsx";
import {newSizeModal, sizeList} from "@/store/Sizes.ts";
import {colorList, newColorModal} from "@/store/Color.ts";
import {Input} from "@/components/ui/input.tsx";


interface Props {
    form: any;
    onSubmit: any;
}

export default function ModelForm({ form, onSubmit }: Props) {
    // Translation
    const { t } = useTranslation();

    // Dropdown state
    const ordersList = useRecoilValue(orderList);
    const categoryOneList = useRecoilValue(productCategoryOneList);
    const categoryTwoList = useRecoilValue(productCategoryTwoList);
    const templateList = useRecoilValue(textileList);
    const textilesList = useRecoilValue(textileList);
    const sizesList = useRecoilValue(sizeList);
    const colorsList = useRecoilValue(colorList);

    // Modals States
    const setNewOrderModal = useSetRecoilState(newOrderModal);
    const setNewCategoryOneModal = useSetRecoilState(newProductCategoryOneModal);
    const setNewCategoryTwoModal = useSetRecoilState(newProductCategoryTwoModal);
    const setNewTextileModal = useSetRecoilState(newTextileModal);
    const setNewSizeModal = useSetRecoilState(newSizeModal);
    const setNewColorModal = useSetRecoilState(newColorModal);

    const handleSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-2" id="model">
                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("Order")}
                                placeholder="Search Order..."
                                emptyBox="No Order found"
                                form={form}
                                name="order"
                                selectText="Select Order"
                                items={ordersList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewOrderModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category1"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("ProductCategoryOne")}
                                placeholder="Search Category One..."
                                emptyBox="No category one found"
                                form={form}
                                name="category1"
                                selectText="Select Category One"
                                items={categoryOneList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewCategoryOneModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category2"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("ProductCategoryTwo")}
                                placeholder="Search Category Two..."
                                emptyBox="No category two found"
                                form={form}
                                name="category2"
                                selectText="Select Category Two"
                                items={categoryTwoList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewCategoryTwoModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />


                <FormField
                    control={form.control}
                    name="textile"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("Textiles")}
                                placeholder="Search Textile..."
                                emptyBox="No textile found"
                                form={form}
                                name="textile"
                                selectText="Select Textile"
                                items={textilesList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewTextileModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("Template")}
                                placeholder="Search Template..."
                                emptyBox="No template found"
                                form={form}
                                name="template"
                                selectText="Select Template"
                                items={templateList}
                            />
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ModelNumber"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ModelNumber")}
                            field={field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="ModelName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ModelName")}
                            field={field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="sizes"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <SelectFieldForForm
                                field={field}
                                label={t("sizes")}
                                placeholder="Select a size"
                                items={sizesList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewSizeModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="colors"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <SelectFieldForForm
                                field={field}
                                label={t("colors")}
                                placeholder="Select a colors"
                                items={colorsList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewColorModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ModelNumber"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ModelNumber")}
                            field={field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="ModelName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ModelName")}
                            field={field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="TotalQuantity"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("TotalQuantity")}
                            field={field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="Characteristics"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Characteristics")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Barcode"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Barcode")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="LabelType"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("LabelType")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="PrintName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("PrintName")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="PrintLocation"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("PrintLocation")}
                            field={field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="Description"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Description")}
                            field={field}
                        />
                    )}
                />

                <FormItem>
                    <FormLabel>{"Images"}</FormLabel>
                    <Input
                        type="file"
                        accept=""
                    />
                </FormItem>
            </form>
        </Form>
    );
}
