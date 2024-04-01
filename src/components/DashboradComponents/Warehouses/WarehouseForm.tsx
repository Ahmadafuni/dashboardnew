import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

export default function WarehouseForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="warehouse"
            >
                <FormField
                    control={form.control}
                    name="WarehouseName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Warehouse Name")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="CategoryName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("CategoryName")}
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
                    name="Capacity"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            type="number"
                            placeholder=""
                            label={t("Capacity")}
                            field={field}
                        />
                    )}
                />
            </form>
        </Form>
    );
}
