import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { externalMovementSchema } from "@/form_schemas/newMaterialMovementSchema";
import { material } from "@/store/Material";
import { newExternalMovementModal } from "@/store/MaterialMovement";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import ExternalMovementForm from "./ExternalMovementForm";

export default function NewExternalMovement() {
  const [open, setOpen] = useRecoilState(newExternalMovementModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentMaterial = useRecoilValue(material);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof externalMovementSchema>>({
    resolver: zodResolver(externalMovementSchema),
    defaultValues: {
      ChildMaterial: "",
      Quantity: "",
      MovementDate: new Date(),
      MovementType: "",
      UnitOfQuantity: "",
      Warehouse: "",
      Supplier: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof externalMovementSchema>) => {
    setIsLoading(true);
    if (currentMaterial.hasChildren && !data.ChildMaterial) {
      toast.error("Please select a child material!");
      return;
    }
    try {
      const newMaterialMovement = await axios.post(
        "materialmovement/external",
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
        <ExternalMovementForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button type="submit" disabled={isLoading} form="external-movement">
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
