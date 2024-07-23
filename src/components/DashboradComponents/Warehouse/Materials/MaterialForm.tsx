import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  materialCategoryList,
  newMaterialCategoryModal,
} from "@/store/MaterialCategory.ts";
import CheckboxForForm from "@/components/common/CheckboxForForm";

interface Props {
  form: any;
  onSubmit: any;
}

export default function MaterialForm({ form, onSubmit }: Props) {
  const { t } = useTranslation();

  const categoryList = useRecoilValue(materialCategoryList);
  const setNewMaterialCategoryModal = useSetRecoilState(
    newMaterialCategoryModal
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="material"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Name")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("MaterialCategory")}
                placeholder="Search Material Category..."
                emptyBox="No category found"
                form={form}
                name="category"
                selectText="Select Category"
                items={categoryList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewMaterialCategoryModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="unitOfMeasure"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("UnitOfMeasure")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="minimumLimit"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("MinimumLimit")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="usageLocation"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("UsageLocation")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="alternativeMaterials"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("AlternativeMaterials")}
              field={field}
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
        <div></div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="hasChildren"
            render={({ field }) => (
              <CheckboxForForm label={t("HasChildren")} field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="isRelevantToProduction"
            render={({ field }) => (
              <CheckboxForForm
                label={t("IsRelevantToProduction")}
                field={field}
              />
            )}
          />
        </div>
      </form>
    </Form>
  );
}
