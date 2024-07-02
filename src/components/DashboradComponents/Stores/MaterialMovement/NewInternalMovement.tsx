import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import { newInternalMovementModal } from "@/store/MaterialMovement.ts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";
import { internalMovementSchema } from "@/form_schemas/newMaterialMovementSchema.ts";
import InternalMovementForm from "./InternalMovementForm";
import { material } from "@/store/Material";

export default function NewInternalMovement() {
  const [open, setOpen] = useRecoilState(newInternalMovementModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentMaterial = useRecoilValue(material);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof internalMovementSchema>>({
    resolver: zodResolver(internalMovementSchema),
    defaultValues: {
      ChildMaterial: "",
      DepartmentFrom: "",
      DepartmentTo: "",
      Quantity: "",
      MovementDate: new Date(),
      MovementType: "",
      UnitOfQuantity: "",
      WarehouseFrom: "",
      WarehouseTo: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof internalMovementSchema>) => {
    setIsLoading(true);
    if (currentMaterial.hasChildren && !data.ChildMaterial) {
      toast.error("Please select a child material!");
      return;
    }
    if (!data.DepartmentFrom && !data.WarehouseFrom) {
      toast.error(
        "Please select a department or warehouse to move material from!"
      );
      return;
    }
    if (data.DepartmentFrom && data.WarehouseFrom) {
      toast.error(
        "Please select either department or warehouse to move material from!"
      );
      return;
    }
    if (!data.DepartmentTo && !data.WarehouseTo) {
      toast.error(
        "Please select a department or warehouse to move material to!"
      );
      return;
    }
    if (data.DepartmentTo && data.WarehouseTo) {
      toast.error(
        "Please select either department or warehouse to move material to!"
      );
      return;
    }
    try {
      const newMaterialMovement = await axios.post(
        "materialmovement/internal",
        { ...data, ParentMaterial: currentMaterial.id },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newMaterialMovement.data.message);
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
          <DialogTitle>{t("New Material Movement")}</DialogTitle>
        </DialogHeader>
        <InternalMovementForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button type="submit" disabled={isLoading} form="internal-movement">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Please wait")}
              </>
            ) : (
              t("Add")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
