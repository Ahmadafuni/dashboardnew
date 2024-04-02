import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {materialCategoryList, newMaterialCategoryModal} from "@/store/MaterialCategory.ts";

interface Props {
    form: any;
    onSubmit: any;
}

export default function MaterialForm ({ form, onSubmit }: Props)  {
    const { t } = useTranslation();

    const categoryList = useRecoilValue(materialCategoryList);
    const setNewMaterialCategoryModal = useSetRecoilState(newMaterialCategoryModal);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-2"
                id="material"
            >
                <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Name")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Type"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Type")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("MaterialCategory")}
                                placeholder="Search Material Category..."
                                emptyBox="No category found"
                                form={form}
                                name="category"
                                selectText="Select Category"
                                items={categoryList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewMaterialCategoryModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="Color"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Color")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="MinimumStockLevel"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("MinimumStockLevel")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="MaximumStockLevel"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("MaximumStockLevel")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="UnitOfMeasure"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("UnitOfMeasure")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Location"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Location")}
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
            </form>
        </Form>
    );
};
