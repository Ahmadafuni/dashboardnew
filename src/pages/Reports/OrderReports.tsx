import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Form } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { templatePatternList } from "@/store/TemplatePattern";
import { templateTypeList } from "@/store/TemplateType";
import { textileList } from "@/store/Textiles";
import {
  filterOrderModels,
  getAllDropdownOptions,
} from "@/services/Model.services";
import FieldWithCheckbox from "@/components/common/CheckboxWIthField";
import { departmentList } from "@/store/Department";
import CheckboxWithTextField from "@/components/common/CheckboxWithTextField";
import { orderList } from "@/store/Orders";
import { modelList } from "@/store/Models";
import { ColumnDef } from "@tanstack/react-table";
import { ModelTypes } from "@/types/Models/Models.types.ts";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useReactToPrint } from "react-to-print";

export default function OrderReports() {
  const { t } = useTranslation();
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [reports, setReports] = useState<ModelTypes[]>([]);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
  const [isStatusEnabled, setStatusEnabled] = useState(false);
  const [isDepartmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [isDepartmentsNamesEnabled, setDepartmentsNamesEnabled] =
    useState(false);
  const [isProductCatalogueEnabled, setProductCatalogueEnabled] =
    useState(false);
  const [isProductCategoryOneEnabled, setProductCategoryOneEnabled] =
    useState(false);
  const [isProductCategoryTwoEnabled, setProductCategoryTwoEnabled] =
    useState(false);
  const [isTextileEnabled, setTextileEnabled] = useState(false);
  const [isTemplateTypeEnabled, setTemplateTypeEnabled] = useState(false);
  const [isTemplatePatternEnabled, setTemplatePatternEnabled] = useState(false);
  const [isOrderEnabled, setOrderEnabled] = useState(false);
  const [isModelEnabled, setModelEnabled] = useState(false);
  const [isBarcodeEnabled, setBarcodeEnabled] = useState(false);

  const setDepartmentList = useSetRecoilState(departmentList);
  const setProductCatalogueList = useSetRecoilState(productCatalogueList);
  const setProductCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setProductCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setTemplatePatternList = useSetRecoilState(templatePatternList);
  const setTemplateTypeList = useSetRecoilState(templateTypeList);
  const setTextileList = useSetRecoilState(textileList);
  const setOrderList = useSetRecoilState(orderList);
  const setModelList = useSetRecoilState(modelList);
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current ?? null,
    documentTitle: `Report${new Date()
      .toLocaleString()
      .replace(/[/,: ]/g, "_")}`,
  });
  async function fetchData(withModels: boolean) {
    try {
      withModels &&
        (await filterOrderModels(
          setReports,
          {},
          pages,
          sizes,
          setTotalPages,
          setIsLoading
        ));
      const data = await getAllDropdownOptions();
      setDepartmentList(data.departments);
      setProductCatalogueList(data.productCatalogues);
      setProductCategoryOneList(data.productCategoryOne);
      setProductCategoryTwoList(data.productCategoryTwo);
      setTemplatePatternList(data.templatePattern);
      setTemplateTypeList(data.templateType);
      setTextileList(data.textiles);
      setOrderList(data.orders);
      setModelList(data.models);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  useEffect(() => {
    fetchData(false);
  }, []);

  useEffect(() => {
    filterOrderModels(
      setReports,
      {},
      pages,
      sizes,
      setTotalPages,
      setIsLoading
    );
  }, [pages, sizes]);

  const departmentsNamesOptions = useRecoilValue(departmentList);
  const productCatalogueOptions = useRecoilValue(productCatalogueList);
  const productCategoryOneOptions = useRecoilValue(productCategoryOneList);
  const productCategoryTwoOptions = useRecoilValue(productCategoryTwoList);
  const templatePatternOptions = useRecoilValue(templatePatternList);
  const templateTypeOptions = useRecoilValue(templateTypeList);
  const textilesOptions = useRecoilValue(textileList);
  const ordersOptions = useRecoilValue(orderList);
  const modelsOptions = useRecoilValue(modelList);

  const departmentsNamesMenu = departmentsNamesOptions.map((dept: any) => ({
    value: dept.Id + "",
    label: dept.StageName,
  }));

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
  const ordersMenu = ordersOptions.map((ord: any) => ({
    value: ord.OrderNumber,
    label: ord.OrderNumber,
  }));

  const barcodesMenu = modelsOptions.map((model: any) => {
    return {
      value: model.Barcode,
      label: model.Barcode,
    };
  });

  const demoModelNumbersMenu = modelsOptions.map((model: any) => {
    return {
      value: model.DemoModelNumber,
      label: model.DemoModelNumber,
    };
  });

  const onSubmit = async (data: any) => {
    try {
      await filterOrderModels(
        setReports,
        data,
        pages,
        sizes,
        setTotalPages,
        setIsLoading
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
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

  const reportsColumns: ColumnDef<any>[] = [
    { accessorKey: "modelNumber", header: t("Model Number") },
    { accessorKey: "barcode", header: t("Barcode") },
    { accessorKey: "collection", header: t("Collection") },
    { accessorKey: "order", header: t("Order") },
    { accessorKey: "name", header: t("Name") },
    { accessorKey: "textile", header: t("Textiles") },
    { accessorKey: "colors", header: t("Color") },
    { accessorKey: "sizes", header: t("Sizes") },
    { accessorKey: "quantities", header: t("Delivered Quantity") },
    { accessorKey: "currentStage", header: t("CurrentStage") },
    { accessorKey: "modelStatus", header: t("Model Status") },
  ];

  useEffect(() => {
    console.log(reports);
  }, [reports]);

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FieldWithCheckbox
                    name="status"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Status",
                      items: [
                        { label: t("AWAITING"), value: "AWAITING" },
                        { label: t("ON GOING"), value: "ONGOING" },
                        { label: t("ON CONFIRM"), value: "ONCONFIRM" },
                        { label: t("COMPLETED"), value: "COMPLETED" },
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
                      placeholder: "Departments Category",
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
                    name="currentStage"
                    label=""
                    control={form.control}
                    fieldComponent={SelectFieldForForm}
                    fieldProps={{
                      placeholder: "Departments Names",
                      items: departmentsNamesMenu,
                    }}
                    isEnabled={isDepartmentsNamesEnabled}
                    onCheckedChange={() =>
                      handleCheckboxChange(
                        setDepartmentsNamesEnabled,
                        "currentStage",
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
                      placeholder: "Product",
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

                {/* Fourth Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CheckboxWithTextField
                    name="orderNumber"
                    placeholder={t("Order Number")}
                    emptyBox={t("NoOrderFound")}
                    selectText={t("SelectOrder")}
                    items={ordersMenu}
                    control={form.control}
                    form={form}
                    isEnabled={isOrderEnabled}
                    setEnabled={setOrderEnabled}
                    setSelected={(value) => form.setValue("orderNumber", value)}
                  />
                  <CheckboxWithTextField
                    name="demoModelNumber"
                    placeholder={t("ModelNo")}
                    emptyBox={t("NoModelFound")}
                    selectText={t("SelectModel")}
                    items={demoModelNumbersMenu}
                    control={form.control}
                    form={form}
                    isEnabled={isModelEnabled}
                    setEnabled={setModelEnabled}
                    setSelected={(value) =>
                      form.setValue("demoModelNumber", value)
                    }
                  />
                  <CheckboxWithTextField
                    name="barcode"
                    placeholder={t("Barcode")}
                    emptyBox={t("NoBarcodeFound")}
                    selectText={t("SelectBarcode")}
                    items={barcodesMenu}
                    control={form.control}
                    form={form}
                    isEnabled={isBarcodeEnabled}
                    setEnabled={setBarcodeEnabled}
                    setSelected={(value) => form.setValue("barcode", value)}
                  />
                </div>

                {/* Fifth Row */}
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
                    className="text-white-600 bg-[#ff0000]"
                  >
                    {t("RESET")}
                  </Button>

                  <Button
                    type="submit"
                    className="text-white-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("PleaseWait")}
                      </>
                    ) : (
                      t("SEARCH")
                    )}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
          <div className="flex justify-end mt-4 print:hidden ">
            <Button onClick={handlePrint}>{t("DownloadPDF")}</Button>
          </div>
        </form>
      </Form>
      <div id="datatable" className="mt-10" ref={printRef}>
        <DataTable
          columns={reportsColumns}
          data={reports}
          page={pages}
          setPage={setPages}
          size={sizes}
          setSize={setSizes}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
