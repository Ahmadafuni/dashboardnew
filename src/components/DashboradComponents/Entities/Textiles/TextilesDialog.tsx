import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import {useTranslation} from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

const TextilesDialog = ({ form, onSubmit }: Props) => {
    const { t } = useTranslation();
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
                            label= {t("TextileName")}
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
                            label= {t("TextileType")}
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
                            label= {t("Composition")}
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
                            label= {t("Description")}
                            field={field}
                        />
                    )}
                />
            </form>
        </Form>
    );
};

export default TextilesDialog;
