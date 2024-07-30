import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Form } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getMaterialReportMovements } from "@/services/MaterialMovements.services";
import DataTable from "@/components/common/DataTable";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { templatePatternList } from "@/store/TemplatePattern";
import { templateTypeList } from "@/store/TemplateType";
import { textileList } from "@/store/Textiles";
import { getAllDropdownOptions } from "@/services/Model.services";
import FieldWithCheckbox from "@/components/common/CheckboxWIthField";
import { log } from "console";

export default function Reports() {
  const { t } = useTranslation();
  const form = useForm();
  const [reports, setReports] = useState([]);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
  const [isStatusEnabled, setStatusEnabled] = useState(false);
  const [isDepartmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [isProductCatalogueEnabled, setProductCatalogueEnabled] =
    useState(false);
  const [isProductCategoryOneEnabled, setProductCategoryOneEnabled] =
    useState(false);
  const [isProductCategoryTwoEnabled, setProductCategoryTwoEnabled] =
    useState(false);
  const [isTextileEnabled, setTextileEnabled] = useState(false);
  const [isTemplateTypeEnabled, setTemplateTypeEnabled] = useState(false);
  const [isTemplatePatternEnabled, setTemplatePatternEnabled] = useState(false);

  const setProductCatalogueList = useSetRecoilState(productCatalogueList);
  const setProductCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setProductCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setTemplatePatternList = useSetRecoilState(templatePatternList);
  const setTemplateTypeList = useSetRecoilState(templateTypeList);
  const setTextileList = useSetRecoilState(textileList);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllDropdownOptions();
        console.log("response data : ", data);

        setProductCatalogueList(data.productCatalogues);
        setProductCategoryOneList(data.productCategoryOne);
        setProductCategoryTwoList(data.productCategoryTwo);
        setTemplatePatternList(data.templatePattern);
        setTemplateTypeList(data.templateType);
        setTextileList(data.textiles);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, [
    setProductCatalogueList,
    setProductCategoryOneList,
    setProductCategoryTwoList,
    setTemplatePatternList,
    setTemplateTypeList,
    setTextileList,
  ]);

  const productCatalogueOptions = useRecoilValue(productCatalogueList);
  const productCategoryOneOptions = useRecoilValue(productCategoryOneList);
  const productCategoryTwoOptions = useRecoilValue(productCategoryTwoList);
  const templatePatternOptions = useRecoilValue(templatePatternList);
  const templateTypeOptions = useRecoilValue(templateTypeList);
  const textilesOptions = useRecoilValue(textileList);

  const productCatalogueMenu = productCatalogueOptions.map(
    (catalogue: any) => ({
      value: catalogue.Id + "",
      label: catalogue.ProductCatalogName,
    })
  );

  const productCategoryOneMenu = productCategoryOneOptions.map(
    (category: any) => ({
      value: category.Id + "",
      label: category.CategoryName,
    })
  );

  const productCategoryTwoMenu = productCategoryTwoOptions.map(
    (category: any) => ({
      value: category.Id + "",
      label: category.CategoryName,
    })
  );

  const templatePatternMenu = templatePatternOptions.map((pattern: any) => ({
    value: pattern.Id + "",
    label: pattern.TemplatePatternName,
  }));

  const templateTypeMenu = templateTypeOptions.map((type: any) => ({
    value: type.Id + "",
    label: type.TemplateTypeName,
  }));

  const textilesMenu = textilesOptions.map((textile: any) => ({
    value: textile.Id + "",
    label: textile.TextileName,
  }));

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const response = await data;
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleReset = () => {
    form.reset();
    setReports([]);
  };

  const handleCheckboxChange = (setter: any, name: string, resetValue: any) => {
    setter((prev: boolean) => {
      if (prev) {
        form.setValue(name, resetValue);
      }
      return !prev;
    });
  };

  const reportsColumns = [
    { accessorKey: "modelName", header: t("Model Name") },
    { accessorKey: "modelNumber", header: t("Model Number") },
    { accessorKey: "productCatalogues", header: t("Product Catalogues") },
    { accessorKey: "productCategoryOne", header: t("Product Category One") },
    { accessorKey: "productCategoryTwo", header: t("Product Category Two") },
    { accessorKey: "textiles", header: t("Textiles") },
    { accessorKey: "detailColor", header: t("Detail Color") },
    { accessorKey: "detailSize", header: t("Detail Size") },
    { accessorKey: "detailQuantity", header: t("Detail Quantity") },
  ];

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="bg-[var(--card-background)]">
            <CardHeader className="flex-row justify-between">
              <div className="w-fit">Advanced Search Production Reports</div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCardCollapsed(!isCardCollapsed)}
                className="w-fit"
              >
                {isCardCollapsed ? <ChevronDown /> : <ChevronUp />}
              </Button>
            </CardHeader>

            {!isCardCollapsed && (
              <CardContent className="space-y-4">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldWithCheckbox
                    name="status"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Status",
                      items: [
                        { label: t("AWAITING"), value: "1" },
                        { label: t("ON GOING"), value: "2" },
                        { label: t("ON CONFIRM"), value: "3" },
                        { label: t("COMPLETED"), value: "4" },
                      ],
                    }}
                    isEnabled={isStatusEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(setStatusEnabled, "status", "")
                    }
                  />
                  <FieldWithCheckbox
                    name="departments"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Departments Company",
                      items: [
                        { label: t("CUTTING"), value: "1" },
                        { label: t("TAILORING"), value: "2" },
                        { label: t("PRINTING"), value: "3" },
                        { label: t("BOXING"), value: "4" },
                      ],
                    }}
                    isEnabled={isDepartmentsEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setDepartmentsEnabled,
                        "departments",
                        ""
                      )
                    }
                  />
                  <FieldWithCheckbox
                    name="productCatalogue"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Product Catalogue",
                      items: productCatalogueMenu,
                    }}
                    isEnabled={isProductCatalogueEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setProductCatalogueEnabled,
                        "productCatalogue",
                        ""
                      )
                    }
                  />
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldWithCheckbox
                    name="productCategoryOne"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Product Category One",
                      items: productCategoryOneMenu,
                    }}
                    isEnabled={isProductCategoryOneEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setProductCategoryOneEnabled,
                        "productCategoryOne",
                        ""
                      )
                    }
                  />
                  <FieldWithCheckbox
                    name="productCategoryTwo"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Product Category Two",
                      items: productCategoryTwoMenu,
                    }}
                    isEnabled={isProductCategoryTwoEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setProductCategoryTwoEnabled,
                        "productCategoryTwo",
                        ""
                      )
                    }
                  />
                  <FieldWithCheckbox
                    name="textile"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Textile",
                      items: textilesMenu,
                    }}
                    isEnabled={isTextileEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(setTextileEnabled, "textile", "")
                    }
                  />
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldWithCheckbox
                    name="templateType"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Template Type",
                      items: templateTypeMenu,
                    }}
                    isEnabled={isTemplateTypeEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setTemplateTypeEnabled,
                        "templateType",
                        ""
                      )
                    }
                  />

                  <FieldWithCheckbox
                    name="templatePattern"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Template Pattern",
                      items: templatePatternMenu,
                    }}
                    isEnabled={isTemplatePatternEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setTemplatePatternEnabled,
                        "templatePattern",
                        ""
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldWithCheckbox
                    name="startDate"
                    label={t("From")}
                    control={form.control}
                    fieldComponent={DatePickerForForm}
                    fieldProps={{
                      isDisabled: !isStartDateEnabled,
                      allowPastDates: true,
                    }}
                    isEnabled={isStartDateEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setIsStartDateEnabled,
                        "startDate",
                        null
                      )
                    }
                  />
                  <FieldWithCheckbox
                    name="endDate"
                    label={t("To")}
                    control={form.control}
                    fieldComponent={DatePickerForForm}
                    fieldProps={{
                      isDisabled: !isEndDateEnabled,
                      allowPastDates: true,
                    }}
                    isEnabled={isEndDateEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(setIsEndDateEnabled, "endDate", null)
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="text-white-600"
                  >
                    {t("RESET")}
                  </Button>
                  <Button type="submit" className="text-white-600 bg-[#ff0000]">
                    {t("SEARCH")}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
          <div className="flex justify-end mt-4 print:hidden ">
            <Button onClick={() => window.print()} className="text-white-600">
              {t("DownloadPDF")}
            </Button>
          </div>
        </form>
      </Form>
      <div id="datatable" className="mt-10">
        <DataTable columns={reportsColumns} data={reports} />
      </div>
    </div>
  );
}
