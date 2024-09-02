import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ModelVarientForm from "./ModelVarientForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  currentModelVarientId,
  updateModelVarientModal,
} from "@/store/ModelVarients";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { colorList } from "@/store/Color";
import { sizeList } from "@/store/Sizes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModelVarientSchema } from "@/form_schemas/newModelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getAllColorsList } from "@/services/Colors.services";
import { getAllSizesListByModel } from "@/services/Sizes.service";

type Props = {
  getAllVarients: any;
  modelId: string | undefined;
};
export default function UpdateModelVarientDialog({
                                                   getAllVarients,
                                                   modelId,
                                                 }: Props) {
  const [open, setOpen] = useRecoilState(updateModelVarientModal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const varientId = useRecoilValue(currentModelVarientId);

  const setColor = useSetRecoilState(colorList);
  const setSizes = useSetRecoilState(sizeList);

  const form = useForm<z.infer<typeof ModelVarientSchema>>({
    resolver: zodResolver(ModelVarientSchema),
    defaultValues: {
      Color: "",
      Quantity: "",
      Sizes: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof ModelVarientSchema>) => {
    // Check if the sizes array is empty or not
    if (data.Sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }

    const quantityPerSize = +data.Quantity / data.Sizes.length;

    if (quantityPerSize % 1 !== 0) {
      toast.error(
          "Getting a decimal value after splitting quantity into all sizes in equal parts. Please change the quantity!"
      );
      return;
    }

    // Format the sizes with quantities
    const sizesWithQuantities = data.Sizes.map((size) => ({
      label: size.label,
      value: quantityPerSize,
    }));

    setIsLoading(true);
    try {
      const newVarients = await axios.put(
          `model/varients/${varientId}`,
          { ...data, Sizes: sizesWithQuantities }, // Send formatted sizes
          {
            headers: {
              Authorization: `bearer ${Cookies.get("access_token")}`,
            },
          }
      );
      toast.success(newVarients.data.message);
      getAllVarients();
      form.reset();
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    getAllColorsList(setColor);
    getAllSizesListByModel(setSizes, modelId);
  }, [modelId]); // Depend on modelId

  return (
      <div className="w-full space-y-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("UpdateModelDetails")}</DialogTitle>
            </DialogHeader>
            <ModelVarientForm form={form} onSubmit={onSubmit} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("Close")}
              </Button>
              <Button type="submit" disabled={isLoading} form="model-varient">
                {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("Please wait")}
                    </>
                ) : (
                    t("Update")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}
