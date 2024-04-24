import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productCatalogueList } from "@/store/ProductCatalogue";
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
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}
export default function TemplateForm({
  form,
  onSubmit,
  handleFileChange,
}: Props) {
  // Translation
  const { t } = useTranslation();
  // Dropdown state
  const categoryOneList = useRecoilValue(productCategoryOneList);
  const categoryTwoList = useRecoilValue(productCategoryTwoList);
  const templatePatternsList = useRecoilValue(templatePatternList);
  const templateTypesList = useRecoilValue(templateTypeList);
  const catalogueList = useRecoilValue(productCatalogueList);
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
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
        id="template"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter template name"}
              label={t("Name")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="productCatalog"
          render={({ field }) => (
            <ComboSelectFieldForForm
              field={field}
              label={"Product Catalogue"}
              placeholder="Search Product Catalogue..."
              emptyBox="No product catalogue found"
              form={form}
              name="productCatalog"
              selectText="Select Product Catalogue"
              items={catalogueList}
            />
          )}
        />
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
          name="description"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder={"Enter template description"}
              label={t("Description")}
              field={field}
            />
          )}
        />
        <FormItem>
          <FormLabel>{"Template PDF"}</FormLabel>
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </FormItem>
      </form>
    </Form>
  );
}
