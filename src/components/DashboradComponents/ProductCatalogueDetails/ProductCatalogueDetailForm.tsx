import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import SelectFieldForForm from "@/components/common/SelectFieldForForm.tsx";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import {
  newProductCategoryOneModal,
  productCategoryOneList,
} from "@/store/ProductCategoryOne.ts";
import {
  newProductCategoryTwoModal,
  productCategoryTwoList,
} from "@/store/ProductCategoryTwo.ts";
import {
  newTemplatePatternModal,
  templatePatternList,
} from "@/store/TemplatePattern.ts";
import { newTemplateTypeModal, templateTypeList } from "@/store/TemplateType.ts";
import { newTextileModal, textileList } from "@/store/Textiles.ts";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {useNavigate} from "react-router-dom";

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
    { label: "SPRING", value: "SPRING" },
    { label: "FALL", value: "FALL" },
    { label: "WINTER", value: "WINTER" },
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
  const navigate = useNavigate();
  const handleSubmit = async (data: any) => {
        await onSubmit(data);
        navigate("/dashboard/productcatalogues/cataloguedetails/1");
    };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
                label={t("ProductCategoryOne")}
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
                label={t("ProductCategoryTwo")}
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
                label={t("TemplateType")}
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
                label={t("TemplatePattern")}
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
                label={t("Textiles")}
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
              placeholder=""
              label={t("Grammage")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="standardWeight"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("StandardWeight")}
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
      </form>
    </Form>
  );
}
