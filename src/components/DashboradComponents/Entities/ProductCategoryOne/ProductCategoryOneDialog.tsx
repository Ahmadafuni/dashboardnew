import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import {useTranslation} from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

const ProductCategoryOneDialog = ({ form, onSubmit }: Props) => {
    const { t } = useTranslation();
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="productCategoryOne"
            >
                <FormField
                    control={form.control}
                    name="ProductCatalogCategoryOne"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("ProductCatalogCategoryOne")}
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

export default ProductCategoryOneDialog;
