import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Form } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
import SelectFieldForForm from "@/components/common/SelectFieldForForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { templatePatternList } from "@/store/TemplatePattern";
import {filterOrderReport, getAllDropdownOptions,} from "@/services/Model.services";
import FieldWithCheckbox from "@/components/common/CheckboxWIthField";
import { departmentList } from "@/store/Department";
import { orderList } from "@/store/Orders";
import { ColumnDef } from "@tanstack/react-table";
import { ModelTypes } from "@/types/Models/Models.types.ts";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useReactToPrint } from "react-to-print";
import {CollectionList} from "@/store/Collection.ts";
import MultiSelectForField from "@/components/common/MultiSelectForField.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OrderReports() {
  const { t } = useTranslation();
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);



  interface summary {
    totalModels: number,
    modelsInProgress: number,
    completedModels: number,
    totalRequiredQuantity: number,
    totalDeliveredQuantity: number,
    completionPercentage: string
  }
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<summary>({
    totalModels: 0,
    modelsInProgress: 0,
    completedModels: 0,
    totalRequiredQuantity: 0,
    totalDeliveredQuantity: 0,
    completionPercentage: '0 %'
  });


  


  const [reports, setReports] = useState<ModelTypes[]>([]);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);

  const [isCollectionEnabled, setCollectionEnabled] = useState(false);
  const [isOrderEnabled, setOrderEnabled] = useState(false);


  const [isStatusEnabled, setStatusEnabled] = useState(false);
  const [isDepartmentsNamesEnabled, setDepartmentsNamesEnabled] = useState(false);

  const [isProductCatalogueEnabled, setProductCatalogueEnabled] = useState(false);
  const [isProductCategoryOneEnabled, setProductCategoryOneEnabled] = useState(false);
  const [isProductCategoryTwoEnabled, setProductCategoryTwoEnabled] = useState(false);

  const [isTemplatePatternEnabled, setTemplatePatternEnabled] = useState(false);

  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);


  const setCollectiontList = useSetRecoilState(CollectionList);
  const setOrderList = useSetRecoilState(orderList);
  // Status Model List
  const setDepartmentList = useSetRecoilState(departmentList);

  const setProductCatalogueList = useSetRecoilState(productCatalogueList);
  const setProductCategoryOneList = useSetRecoilState(productCategoryOneList);
  const setProductCategoryTwoList = useSetRecoilState(productCategoryTwoList);
  const setTemplatePatternList = useSetRecoilState(templatePatternList);


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
        (await filterOrderReport(
          setReports,
          {},
          pages,
          sizes,
          setSummaryData,
          setTotalPages,
          setIsLoading,
        ));
      const data = await getAllDropdownOptions();

      setCollectiontList(data.collections);
      setDepartmentList(data.departments);
      setProductCatalogueList(data.productCatalogues);
      setProductCategoryOneList(data.productCategoryOne);
      setProductCategoryTwoList(data.productCategoryTwo);
      setTemplatePatternList(data.templatePattern);
      setOrderList(data.orders);
    }
    catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  useEffect(() => {
    fetchData(false);
  }, []);


  const collectionsOptions = useRecoilValue(CollectionList);
  const ordersOptions = useRecoilValue(orderList);

  const departmentsNamesOptions = useRecoilValue(departmentList);
  const productCatalogueOptions = useRecoilValue(productCatalogueList);
  const productCategoryOneOptions = useRecoilValue(productCategoryOneList);
  const productCategoryTwoOptions = useRecoilValue(productCategoryTwoList);
  const templatePatternOptions = useRecoilValue(templatePatternList);

  const collectionsNamesMenu = collectionsOptions.map((col: any) => ({
    value: col.Id + "",
    label: col.CollectionName,
  }));

  const ordersMenu = ordersOptions.map((ord: any) => ({
    value: ord.Id+ "",
    label: ord.OrderName,
  }));

  const departmentsNamesMenu = departmentsNamesOptions.map((dept: any) => ({
    value: dept.Id + "",
    label: dept.Name,
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

  const onSubmit = async (data: any) => {

    try {
      await filterOrderReport(
        setReports,
        data,
        pages,
        sizes,
        setSummaryData,
        setTotalPages,
        setIsLoading,
      );
      setShowSummary(true);

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

    setShowSummary(false);

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
    console.log("reports" , reports);
    console.log("summaryData" , summaryData);

  }, [reports , summaryData]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="bg-[var(--card-background)]">
            <CardHeader className="flex-row justify-between">
              <div className="w-fit">{t("AdvancedSearchOrderReports")}</div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FieldWithCheckbox
                      name="collections"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        items: collectionsNamesMenu,
                        form: form,
                        name: "collections",
                        selectText: "collections",
                      }}
                      isEnabled={isCollectionEnabled}
                      onCheckedChange={() => handleCheckboxChange(setCollectionEnabled, "collections", "")}
                  />

                  <FieldWithCheckbox
                      name="orders"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        items: ordersMenu,
                        form: form,
                        name: "orders",
                        selectText: "orders",
                      }}
                      isEnabled={isOrderEnabled}
                      onCheckedChange={() => handleCheckboxChange(setOrderEnabled, "orders", "")
                      }
                  />
                  <FieldWithCheckbox
                      name="status"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        items: [
                          { label: t("PENDING"), value: "PENDING" },
                          { label: t("ONGOING"), value: "ONGOING" },
                          { label: t("ONHOLD"), value: "ONHOLD" },
                          { label: t("COMPLETED"), value: "COMPLETED" },
                        ],
                        form: form,
                        name: "status",
                        selectText: "Status",
                      }}
                      isEnabled={isStatusEnabled}
                      onCheckedChange={() => handleCheckboxChange(setStatusEnabled, "status", "")}
                  />
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldWithCheckbox
                      name="departments"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        placeholder: "Departments Names",
                        items: departmentsNamesMenu,
                        form: form,
                        name: "departments",
                        selectText: "departments",
                      }}
                      isEnabled={isDepartmentsNamesEnabled}
                      onCheckedChange={() => handleCheckboxChange(setDepartmentsNamesEnabled, "currentStage", "")}
                  />

                  <FieldWithCheckbox
                      name="templatePattern"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        placeholder: "Template Pattern",
                        items: templatePatternMenu,
                        form: form,
                        name: "templatePattern",
                        selectText: "templatePattern",
                      }}
                      isEnabled={isTemplatePatternEnabled}
                      onCheckedChange={() => handleCheckboxChange(setTemplatePatternEnabled, "templatePattern", "")}
                  />
                </div>
                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      onCheckedChange={() => handleCheckboxChange(setProductCatalogueEnabled, "productCatalogue", "")}
                  />
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
                      onCheckedChange={() => handleCheckboxChange(setProductCategoryOneEnabled, "productCategoryOne", "")}
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
                          handleCheckboxChange(setProductCategoryTwoEnabled, "productCategoryTwo", "")}
                  />

                </div>
                {/* Fourth Row */}
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
                      handleCheckboxChange(setIsStartDateEnabled, "startDate", null)}
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
                    {t("Reset")}
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
                      t("Search")
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

      {showSummary && summaryData != null && (
      <div className="mt-10">
        <Card className="bg-[var(--card-background)] mt-10">
          <CardHeader>
            <CardTitle>{t("Report Summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الحقل</TableHead>
                  <TableHead>القيمة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>عدد الموديلات</TableCell>
                  <TableCell>{summaryData.totalModels}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>الكمية المطلوبة</TableCell>
                  <TableCell>{summaryData.totalRequiredQuantity} قطعة</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>عدد الموديلات قيد العمل</TableCell>
                  <TableCell>{summaryData.modelsInProgress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>الكمية المنجزة</TableCell>
                  <TableCell>{summaryData.totalDeliveredQuantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>عدد الموديلات المنجزة</TableCell>
                  <TableCell>{summaryData.completedModels}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>نسبة الإنجاز</TableCell>
                  <TableCell>{summaryData.completionPercentage}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )}
      

      <div id="datatable" className="mt-10" ref={printRef}>
        <DataTable
          columns={reportsColumns}
          data={reports}
          page={pages}
          setPage={setPages}
          size={sizes}
          setSize={setSizes}
          totalPages={totalPages}
          tableName="Models"
          fieldFilter={{
            "ModelNumber" : "ModelNumber"
          }}
        />
      </div>
    </div>
  );
}
