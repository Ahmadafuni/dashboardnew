import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Form } from "@/components/ui/form";
import DatePickerForForm from "@/components/common/DatePickerForForm";
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
  filterProductionModels,
  getAllDropdownOptions,
} from "@/services/Model.services";
import FieldWithCheckbox from "@/components/common/CheckboxWIthField";
import { departmentList } from "@/store/Department";
import { orderList } from "@/store/Orders";
import { modelList } from "@/store/Models";
import { ColumnDef } from "@tanstack/react-table";
import { ModelTypes } from "@/types/Models/Models.types.ts";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useReactToPrint } from "react-to-print";
import MultiSelectForField from "@/components/common/MultiSelectForField.tsx";

export default function ProductionReports() {
  const { t } = useTranslation();
  const form = useForm();
  const [pages, setPages] = useState(1);
  const [sizes, setSizes] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  const [isTemplateTypeEnabled, setTemplateTypeEnabled] = useState(false);
  const [isTemplatePatternEnabled, setTemplatePatternEnabled] = useState(false);
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
        (await filterProductionModels(
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
    filterProductionModels(
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

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await filterProductionModels(
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
    setIsLoading(false);
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
    { accessorKey: "name", header: t("Name") },
    { accessorKey: "textile", header: t("Textiles") },
    { accessorKey: "colors", header: t("Color") },
    { accessorKey: "sizes", header: t("Sizes") },
    { accessorKey: "quantities", header: t("Delivered Quantity") },
    { accessorKey: "currentStage", header: t("CurrentStage") },
    { accessorKey: "duration", header: t("Duration") },
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldWithCheckbox
                      name="status"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        items: [
                          { label: t("AWAITING"), value: "AWAITING" },
                          { label: t("ONGOING"), value: "ONGOING" },
                          { label: t("ON CONFIRM"), value: "ONCONFIRM" },
                          { label: t("COMPLETED"), value: "COMPLETED" },
                        ],
                        form: form,
                        name: "status",
                        selectText: "Status",
                      }}
                      isEnabled={isStatusEnabled}
                      onCheckedChange={() => handleCheckboxChange(setStatusEnabled, "status", "")
                      }
                  />

                  <FieldWithCheckbox
                    name="departments"
                    label=""
                    control={form.control}
                    fieldComponent={MultiSelectForField}
                    fieldProps={{
                      items: [
                        { label: t("CUTTING"), value: "1" },
                        { label: t("TAILORING"), value: "2" },
                        { label: t("PRINTING"), value: "3" },
                        { label: t("BOXING"), value: "4" },
                      ],
                      form: form,
                      name: "departments",
                      selectText: "departments",
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
                    fieldComponent={MultiSelectForField}
                    fieldProps={{
                      items: departmentsNamesMenu,
                      form: form,
                      name: "currentStage",
                      selectText: "currentStage",
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

                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldWithCheckbox
                      name="productCatalogue"
                      label=""
                      control={form.control}
                      fieldComponent={MultiSelectForField}
                      fieldProps={{
                        items: productCatalogueMenu,
                        form: form,
                        name: "productCatalogue",
                        selectText: "product",
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
                  <FieldWithCheckbox
                    name="productCategoryOne"
                    label=""
                    control={form.control}
                    fieldComponent={MultiSelectForField}
                    fieldProps={{
                      items: productCategoryOneMenu,
                      form: form,
                      name: "productCategoryOne",
                      selectText: "productCategoryOne",
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
                    fieldComponent={MultiSelectForField}
                    fieldProps={{
                      items: productCategoryTwoMenu,
                      form: form,
                      name: "productCategoryTwo",
                      selectText: "productCategoryTwo",
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

                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldWithCheckbox
                    name="templateType"
                    label=""
                    control={form.control}
                    fieldComponent={MultiSelectForField}
                    fieldProps={{
                      items: templateTypeMenu,
                      form: form,
                      name: "templateType",
                      selectText: "templateType",

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
                    fieldComponent={MultiSelectForField}
                    fieldProps={{
                      items: templatePatternMenu,
                      form: form,
                      name: "templatePattern",
                      selectText: "templatePattern",
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
