import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CollectionList, newCollectionModal } from "@/store/Collection.ts";
import { Input } from "@/components/ui/input";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}

const OrderForm = ({ form, onSubmit, handleFileChange }: Props) => {
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
          name="orderName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("OrderName")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="collection"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("Collections")}
                placeholder="Search Collection..."
                emptyBox="No Collection found"
                form={form}
                name="collection"
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
          name="quantity"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Quantity")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("DeadlineDate")}
              field={field}
              type="date"
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Description")}
              field={field}
            />
          )}
        />
        <FormItem>
          <FormLabel>{t("OrderFile")}</FormLabel>
          <Input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
          />
        </FormItem>
      </form>
    </Form>
  );
};

export default OrderForm;
