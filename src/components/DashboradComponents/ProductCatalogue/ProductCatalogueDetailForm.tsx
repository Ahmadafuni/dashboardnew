import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  newProductCategoryOneModal,
  productCategoryOneList,
} from "@/store/ProductCategoryOne";
import {
  newProductCategoryTwoModal,
  productCategoryTwoList,
} from "@/store/ProductCategoryTwo";
import {
  newTemplatePatternModal,
  templatePatternList,
} from "@/store/TemplatePattern";
import { newTemplateTypeModal, templateTypeList } from "@/store/TemplateType";
import { newTextileModal, textileList } from "@/store/Textiles";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
}
export default function ProductCatalogueDetailForm({ form, onSubmit }: Props) {
  // Translation
  const { t } = useTranslation();
  // Dropdown state
  const categoryOneList = useRecoilValue(productCategoryOneList);
  const categoryTwoList = useRecoilValue(productCategoryTwoList);
  const templatePatternsList = useRecoilValue(templatePatternList);
  const templateTypesList = useRecoilValue(templateTypeList);
  const textilesList = useRecoilValue(textileList);
  const seasons = [
    { label: "SUMMER", value: "SUMMER" },
    { label: "FALL", value: "FALL" },
    { label: "WINTER", value: "WINTER" },
    { label: "SPRING", value: "SPRING" },
  ];
  // Modals States
  const setNewProductCategoryOneModal = useSetRecoilState(
    newProductCategoryOneModal
  );
  const setNewProductCategoryTwoModal = useSetRecoilState(
    newProductCategoryTwoModal
  );
  const setNewTemplatePatternModal = useSetRecoilState(newTemplatePatternModal);
  const setNewTemplateTypeModal = useSetRecoilState(newTemplateTypeModal);
  const setNewTextileModal = useSetRecoilState(newTextileModal);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="catalogue-detail"
      >
        <FormField
          control={form.control}
          name="category1"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={"Category One"}
                placeholder="Search Category One..."
                emptyBox="No category one found"
                form={form}
                name="category1"
                selectText="Select Category One"
                items={categoryOneList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewProductCategoryOneModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="category2"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={"Category Two"}
                placeholder="Search Category Two..."
                emptyBox="No category two found"
                form={form}
                name="category2"
                selectText="Select Category Two"
                items={categoryTwoList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewProductCategoryTwoModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="templateType"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={"Template Type"}
                placeholder="Search Template Type..."
                emptyBox="No template type found"
                form={form}
                name="templateType"
                selectText="Select Template Type"
                items={templateTypesList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewTemplateTypeModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="templatePattern"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={"Template Pattern"}
                placeholder="Search Template Pattern..."
                emptyBox="No template pattern found"
                form={form}
                name="templatePattern"
                selectText="Select Template Pattern"
                items={templatePatternsList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewTemplatePatternModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("Season")}
              placeholder="Select a season..."
              items={seasons}
            />
          )}
        />
        <FormField
          control={form.control}
          name="textile"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={"Textile"}
                placeholder="Search Textile..."
                emptyBox="No textile found"
                form={form}
                name="textile"
                selectText="Select Textile"
                items={textilesList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewTextileModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="grammage"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter grammage"}
              label={"Grammage"}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="standardWeight"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter standard weight"}
              label={"Standard Weight"}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Description"}
              label={"Description"}
              field={field}
            />
          )}
        />
      </form>
    </Form>
  );
}
