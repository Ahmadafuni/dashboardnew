import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";

interface Props {
    form: any;
    onSubmit: any;
}
export default function ColorsDialog({ form, onSubmit }: Props) {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="color"
            >
                <FormField
                    control={form.control}
                    name="ColorName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder={""}
                            label={"ColorName"}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="ColorCode"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder={""}
                            label={"ColorCode"}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Description"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder={""}
                            label={"Description"}
                            field={field}
                        />
                    )}
                />
            </form>
        </Form>
    );
}
