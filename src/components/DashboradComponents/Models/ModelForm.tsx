import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm.tsx";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm.tsx";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { newTextileModal, textileList } from "@/store/Textiles.ts";
import {
  newProductCategoryOneModal,
  productCategoryOneList,
} from "@/store/ProductCategoryOne.ts";
import {
  newProductCategoryTwoModal,
  productCategoryTwoList,
} from "@/store/ProductCategoryTwo.ts";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { sizeList } from "@/store/Sizes.ts";
import { Input } from "@/components/ui/input.tsx";
import {
  newProductCatalogueModal,
  productCatalogueList,
} from "@/store/ProductCatalogue";
import { templateList } from "@/store/Template";
import { getAllSizesListByTemplate } from "@/services/Sizes.service";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}

export default function ModelForm({ form, onSubmit, handleFileChange }: Props) {
  // Translation
  const { t } = useTranslation();

  // Dropdown state
  const categoryOneList = useRecoilValue(productCategoryOneList);
  const categoryTwoList = useRecoilValue(productCategoryTwoList);
  const templatesList = useRecoilValue(templateList);
  const textilesList = useRecoilValue(textileList);
  const setSizesList = useSetRecoilState(sizeList);
  const productCataloguesList = useRecoilValue(productCatalogueList);

  // Modals States
  const setNewCategoryOneModal = useSetRecoilState(newProductCategoryOneModal);
  const setNewCategoryTwoModal = useSetRecoilState(newProductCategoryTwoModal);
  const setNewTextileModal = useSetRecoilState(newTextileModal);

  const setNewProductCatalogueModal = useSetRecoilState(
    newProductCatalogueModal
  );

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-2 gap-2"
        id="model"
      >
        <FormField
          control={form.control}
          name="CategoryOne"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("ProductCategoryOne")}
                placeholder="Search Category One..."
                emptyBox="No category one found"
                form={form}
                name="CategoryOne"
                selectText="Select Category One"
                items={categoryOneList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewCategoryOneModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="CategoryTwo"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("ProductCategoryTwo")}
                placeholder="Search Category Two..."
                emptyBox="No category two found"
                form={form}
                name="CategoryTwo"
                selectText="Select Category Two"
                items={categoryTwoList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewCategoryTwoModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="ProductCatalog"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("ProductCatalogue")}
                placeholder="Search Product Catalogue..."
                emptyBox="No product catalogue one found"
                form={form}
                name="ProductCatalog"
                selectText="Select Product Catalogue"
                items={productCataloguesList}
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewProductCatalogueModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="Template"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("Template")}
                placeholder="Search Template..."
                emptyBox="No template found"
                form={form}
                name="Template"
                selectText="Select Template"
                items={templatesList}
                willRelated={true}
                setRelatedOptions={setSizesList}
                getRelatedOptions={getAllSizesListByTemplate}
              />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="Textile"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                field={field}
                label={t("Textiles")}
                placeholder="Search Textile..."
                emptyBox="No textile found"
                form={form}
                name="Textile"
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
          name="Characteristics"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Characteristics")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Barcode"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("Barcode")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="LabelType"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("LabelType")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="PrintName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("PrintName")}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="PrintLocation"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("PrintLocation")}
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
        <FormItem>
          <FormLabel>{"Images"}</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </FormItem>
      </form>
    </Form>
  );
}
