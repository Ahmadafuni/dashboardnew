import { Button } from "@/components/ui/button.tsx";
import { supplierSchema } from "@/form_schemas/newSupplierSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import SupplierForm from "@/components/DashboradComponents/Warehouse/Suppliers/SupplierForm.tsx";
import { useRecoilState, useRecoilValue } from "recoil";
import { supplier, supplierId } from "@/store/Supplier.ts";
import { updateSupplierModal } from "@/store/Supplier.ts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";

type Props = {
  getSuppliers: any;
};

export default function UpdateSupplier({ getSuppliers }: Props) {
  const supplierID = useRecoilValue(supplierId);
  const [open, setOpen] = useRecoilState(updateSupplierModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentSupplier = useRecoilValue(supplier);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      description: "",
    },
    values: currentSupplier,
  });

  const onSubmit = async (data: z.infer<typeof supplierSchema>) => {
    setIsLoading(true);
    try {
      const updateSupplier = await axios.put(`supplier/${supplierID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(updateSupplier.data.message);
      getSuppliers();
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
            <DialogTitle>{t("UpdateSupplier")}</DialogTitle>
          </DialogHeader>
          <SupplierForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button type="submit" disabled={isLoading} form="supplier">
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("PleaseWait")}
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
