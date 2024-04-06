import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {CollectionList, newCollectionModal} from "@/store/Collection.ts";

interface Props {
    form: any;
    onSubmit: any;
}

const OrderForm = ({ form, onSubmit }: Props) => {
    const { t } = useTranslation();
    const collectionList = useRecoilValue(CollectionList);
    const setNewCollectionModal = useSetRecoilState(newCollectionModal);
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-2"
                id="order"
            >
                <FormField
                    control={form.control}
                    name="OrderNumber"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Order Number")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="OrderName"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Order Name")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="CollectionID"
                    render={({ field }) => (
                        <div className="flex gap-x-1">
                            <ComboSelectFieldForForm
                                field={field}
                                label={t("Collection")}
                                placeholder="Search Collection..."
                                emptyBox="No Collection found"
                                form={form}
                                name="Collection"
                                selectText="Select Collection"
                                items={collectionList}
                            />
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => setNewCollectionModal(true)}
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
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
                            type="number"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="DeadlineDate"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("Deadline Date")}
                            field={field}
                            type="date"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="File"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder=""
                            label={t("File")}
                            field={field}
                            type="file"
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

export default OrderForm;
