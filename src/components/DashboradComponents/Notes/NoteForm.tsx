import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";

interface Props {
    form: any;
    onSubmit: any;
}

export default function NoteForm({ form, onSubmit }: Props) {
    const { t } = useTranslation();


    return (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-2"
                        id="note"
                    >
                        <FormField
                            control={form.control}
                            name="NoteType"
                            render={({ field }) => (
                                <TextInputFieldForForm
                                    placeholder=""
                                    label={t("NoteType")}
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
