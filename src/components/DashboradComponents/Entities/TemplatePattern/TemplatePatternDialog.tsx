import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import {useTranslation} from "react-i18next";

interface Props {
    form: any;
    onSubmit: any;
}

const TemplatePatternDialog = ({ form, onSubmit }: Props) => {
    const { t } = useTranslation();
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="templatePattern"
            >
                <FormField
                    control={form.control}
                    name="TemplatePatternName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("TemplatePatternName")}
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

export default TemplatePatternDialog;
