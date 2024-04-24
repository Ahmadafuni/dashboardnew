import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

export default function TaskForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="task"
            >
                <FormField
                    control={form.control}
                    name="TaskName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("TaskName")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="ImplementationDate"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ImplementationDate")}
                            field={field}
                            type="date"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Status"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Status")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="AssignedToDepartmentId"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("AssignedToDepartmentId")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="AssignedToWarehouseId"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("AssignedToWarehouseId")}
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
