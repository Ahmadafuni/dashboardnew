import SelectFieldForForm from "@/components/common/SelectFieldForForm.tsx";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

export default function MaterialForm ({ form, onSubmit }: Props)  {
    const { t } = useTranslation();

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
                    name="Category"
                    render={({ field }) => (
                        <SelectFieldForForm
                            field={field}
                            label={t("Category")}
                            placeholder=""
                            items={[]}
                        />
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
