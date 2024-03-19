import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";

interface Props {
    form: any;
    onSubmit: any;
}

const TextilesDialog = ({ form, onSubmit }: Props) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="textiles"
            >
                <FormField
                    control={form.control}
                    name="TextileName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label="Textile Name"
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="TextileType"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label="Textile Type"
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="Composition"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label="Composition"
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

export default TextilesDialog;
