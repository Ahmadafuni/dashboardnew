import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

export default function WarehouseForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();

    const categories = [
        { value: "MANAGEMENT", label: t("MANAGEMENT") },
        { value: "PRODUCTION", label: t("PRODUCTION") },
        { value: "SERVICES", label: t("SERVICES") },
    ];

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="warehouse"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("WarehouseName")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <SelectFieldForForm
                            items={categories}
                            placeholder={t("SelectCategory")}
                            label={t("Category")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
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
                    name="capacity"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Capacity")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
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
}
