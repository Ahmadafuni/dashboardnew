import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";

interface Props {
    form: any;
    onSubmit: any;
}

const ProductCategoryTwoDialog = ({ form, onSubmit }: Props) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="productCategoryTwo"
            >
                <FormField
                    control={form.control}
                    name="ProductCatalogCategoryTwo"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label="CategoryNameTwo"
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

export default ProductCategoryTwoDialog;
