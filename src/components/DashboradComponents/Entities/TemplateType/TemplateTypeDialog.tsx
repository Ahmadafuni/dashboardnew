import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";

interface Props {
    form: any;
    onSubmit: any;
}

const TemplateTypeDialog = ({ form, onSubmit }: Props) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="templateType"
            >
                <FormField
                    control={form.control}
                    name="TemplateTypeName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label="TemplateTypeName"
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
                            label="Description"
                            field={field}
                        />
                    )}
                />
            </form>
        </Form>
    );
};

export default TemplateTypeDialog;
