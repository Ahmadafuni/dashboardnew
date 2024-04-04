import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Form, FormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

export default function MaterialMovementForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="materialMovement"
            >
                <FormField
                    control={form.control}
                    name="MaterialId"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("MaterialId")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="FromLocationType"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("FromLocationType")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="FromLocationId"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("FromLocationId")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="ToLocationType"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ToLocationType")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="ToLocationId"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ToLocationId")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="MovementType"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("MovementType")}
                            field={{field}}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Quantity"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Quantity")}
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
}
