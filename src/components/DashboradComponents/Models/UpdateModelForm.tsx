import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAllSizesListByTemplate } from "@/services/Sizes.service";
import { colorList, newColorModal } from "@/store/Color";
import { sizeList } from "@/store/Sizes";
import { templateList } from "@/store/Template";
import { newTextileModal, textileList } from "@/store/Textiles";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

interface Props {
  form: any;
  onSubmit: any;
  handleFileChange: any;
}
export default function UpdateModelForm({
  form,
  onSubmit,
  handleFileChange,
}: Props) {
  // Translation
  const { t } = useTranslation();

  // Dropdown state
  //   const categoryOneList = useRecoilValue(productCategoryOneList);
  //   const categoryTwoList = useRecoilValue(productCategoryTwoList);
  const templatesList = useRecoilValue(templateList);
  const textilesList = useRecoilValue(textileList);
  const [sizesList, setSizesList] = useRecoilState(sizeList);
  const colorsList = useRecoilValue(colorList);
  //   const productCataloguesList = useRecoilValue(productCatalogueList);

  // Modals States
  //   const setNewCategoryOneModal = useSetRecoilState(newProductCategoryOneModal);
  //   const setNewCategoryTwoModal = useSetRecoilState(newProductCategoryTwoModal);
  const setNewTextileModal = useSetRecoilState(newTextileModal);
  const setNewColorModal = useSetRecoilState(newColorModal);
  //   const setNewProductCatalogueModal = useSetRecoilState(
  //     newProductCatalogueModal
  //   );
  const handleSubmit = async (data: any) => {
    await onSubmit(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-2 gap-2"
        id="model-update"
      >
        <FormField
          control={form.control}
          name="ModelName"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("ModelName")}
              field={field}
            />
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
        {/* <FormField
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
    /> */}
        {/* <FormField
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
    /> */}
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
          name="Size"
          render={({ field }) => (
            <SelectFieldForForm
              field={field}
              label={t("Size")}
              placeholder="Select a size"
              items={sizesList}
            />
          )}
        />
        <FormField
          control={form.control}
          name="Color"
          render={({ field }) => (
            <div className="flex gap-x-1">
              <ComboSelectFieldForForm
                emptyBox="No color found"
                field={field}
                label={t("Color")}
                placeholder="Search Colors..."
                name="Color"
                items={colorsList}
                form={form}
                selectText="Select Color"
              />
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setNewColorModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="TotalQuantity"
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={t("TotalQuantity")}
              field={field}
            />
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
            />
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
