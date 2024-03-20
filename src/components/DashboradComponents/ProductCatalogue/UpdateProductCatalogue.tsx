import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { productCatalogueSchema } from "@/form_schemas/newProductCatalogueSchema";
import {
  productCatalogue,
  productCatalogueId,
  updateProductCatalogueModal,
} from "@/store/ProductCatalogue";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import ProductCatalogueDialog from "./ProductCatalogueDialog.tsx";
import {useTranslation} from "react-i18next";

type Props = {
  getCatalogues: any;
};
export default function UpdateProductCatalogue({ getCatalogues }: Props) {
  const catalogueID = useRecoilValue(productCatalogueId);
  const [open, setOpen] = useRecoilState(updateProductCatalogueModal);
  const [isLoading, setIsLoading] = useState(false);
  const catalogue = useRecoilValue(productCatalogue);
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof productCatalogueSchema>>({
    resolver: zodResolver(productCatalogueSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    values: catalogue,
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof productCatalogueSchema>) => {
    setIsLoading(true);
    try {
      const updateCatalogue = await axios.put(
        `productcatalog/${catalogueID}`,
        data
      );
      toast.success(updateCatalogue.data.message);
      getCatalogues();
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
          <DialogTitle>{t("UpdateProductCatalogue")}</DialogTitle>
        </DialogHeader>
        <ProductCatalogueDialog form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="catalogue">
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
