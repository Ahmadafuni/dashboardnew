import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";
import { templateProductCatalogueDetailSearchSchema } from "@/form_schemas/newTemplateSchema.ts";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { productCatalogueDetailsList } from "@/store/ProductCatalogueDetails.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { productCatalogueList } from "@/store/ProductCatalogue";

interface Props {
  form: any;
}

export default function TemplateProductCatalogueDetailSearchForm({
  form,
}: Props) {
  // Dropdown state
  const categoryOneList = useRecoilValue(productCategoryOneList);
  const categoryTwoList = useRecoilValue(productCategoryTwoList);
  const catalogueList = useRecoilValue(productCatalogueList);
  const setPCDS = useSetRecoilState(productCatalogueDetailsList);
  const [isLoading, setIsLoading] = useState(false);

  // Search submit function
  const onSubmitSearch = async (
    data: z.infer<typeof templateProductCatalogueDetailSearchSchema>
  ) => {
    setIsLoading(true);
    try {
      if (
        data.categoryOne.length <= 0 &&
        data.categoryTwo.length <= 0 &&
        data.productCatalogue.length <= 0
      ) {
        toast.warning("Please select at least one field to search!");
        setIsLoading(false);
        return;
      }
      const pcds = await axios.post(
        "productcatalogtdetail/search-by-category",
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setPCDS(pcds.data.data);
      toast.success(pcds.data.message);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        setPCDS([]);
      }
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ backgroundColor: "var(--card-background)" }}>
      <CardHeader>
        <CardDescription>Search Product Catalogue Details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitSearch)}
            className="grid grid-cols-3 gap-2"
            id="template-pcd-search"
          >
            <FormField
              control={form.control}
              name="productCatalogue"
              render={({ field }) => (
                <ComboSelectFieldForForm
                  field={field}
                  label={"Product Catalogue"}
                  placeholder="Search Product ..."
                  emptyBox="No product found"
                  form={form}
                  name="productCatalogue"
                  selectText="Select Product"
                  items={catalogueList}
                />
              )}
            />
            <FormField
              control={form.control}
              name="categoryOne"
              render={({ field }) => (
                <ComboSelectFieldForForm
                  field={field}
                  label={"Category One"}
                  placeholder="Search Category One..."
                  emptyBox="No category one found"
                  form={form}
                  name="categoryOne"
                  selectText="Select Category One"
                  items={categoryOneList}
                />
              )}
            />
            <FormField
              control={form.control}
              name="categoryTwo"
              render={({ field }) => (
                <ComboSelectFieldForForm
                  field={field}
                  label={"Category Two"}
                  placeholder="Search Category Two..."
                  emptyBox="No category two found"
                  form={form}
                  name="categoryTwo"
                  selectText="Select Category Two"
                  items={categoryTwoList}
                />
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={isLoading} form="template-pcd-search">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Search"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
