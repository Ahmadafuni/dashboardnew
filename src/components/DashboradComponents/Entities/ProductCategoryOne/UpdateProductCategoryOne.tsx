import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  productCategoryOne,
  productCategoryOneId,
  updateProductCategoryOneModal,
} from "@/store/ProductCategoryOne.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import ProductCategoryOneDialog from "@/components/DashboradComponents/Entities/ProductCategoryOne/ProductCategoryOneDialog.tsx";
import { ProductCategoryOneSchema } from "@/form_schemas/newProductCategoryOneSchema.ts";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

type Props = {
  getProductCategoriesOne: () => void;
};

export default function UpdateProductCategoryOne({
  getProductCategoriesOne,
}: Props) {
  const productCategoryOneID = useRecoilValue(productCategoryOneId);
  const [open, setOpen] = useRecoilState(updateProductCategoryOneModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentProductCategoryOne = useRecoilValue(productCategoryOne);
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(ProductCategoryOneSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    values: currentProductCategoryOne,
  });

  const onSubmit = async (data: z.infer<typeof ProductCategoryOneSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `productcatalogcategoryone/${productCategoryOneID}`,
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(response.data.message);
      getProductCategoriesOne(); // Refresh product categories after update
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("UpdateProductCategoryOne")}</DialogTitle>
        </DialogHeader>
        <ProductCategoryOneDialog form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            form="product-category-one"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              t("Update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
