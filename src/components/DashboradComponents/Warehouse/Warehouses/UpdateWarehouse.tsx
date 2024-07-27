import { Button } from "@/components/ui/button.tsx";
import { warehouseSchema } from "@/form_schemas/newWarehouseSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import WarehouseForm from "@/components/DashboradComponents/Warehouse/Warehouses/WarehouseForm.tsx";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  updateWarehouseModal,
  warehouse,
  warehouseId,
} from "@/store/Warehouse.ts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";

type Props = {
  getWarehouse: any;
};

export default function UpdateWarehouse({ getWarehouse }: Props) {
  const warehouseID = useRecoilValue(warehouseId);
  const [open, setOpen] = useRecoilState(updateWarehouseModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentWarehouse = useRecoilValue(warehouse);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof warehouseSchema>>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      capacity: "",
      category: "",
      location: "",
      name: "",
      description: "",
    },
    values: currentWarehouse,
  });

  const onSubmit = async (data: z.infer<typeof warehouseSchema>) => {
    setIsLoading(true);
    try {
      const updateWarehouse = await axios.put(
          `warehouse/${warehouseID}`,
          data,
          {
            headers: {
              Authorization: `bearer ${Cookies.get("access_token")}`,
            },
          }
      );
      toast.success(updateWarehouse.data.message);
      getWarehouse();
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
            <DialogTitle>{t("UpdateWarehouse")}</DialogTitle>
          </DialogHeader>
          <WarehouseForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button type="submit" disabled={isLoading} form="warehouse">
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
