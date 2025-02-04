import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { color, colorId, updateColorModal } from "@/store/Color.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { colorSchema } from "@/form_schemas/newColorSchema.ts";
import ColorForm from "@/components/DashboradComponents/Entities/Colors/ColorForm";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

type Props = {
  getColors: () => void;
};

export default function UpdateColor({ getColors }: Props) {
  const colorID = useRecoilValue(colorId);
  const [open, setOpen] = useRecoilState(updateColorModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentColor = useRecoilValue(color);
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      ColorName: "",
      ColorCode: "",
      Description: "",
    },
    values: currentColor,
  });
  const onSubmit = async (data: z.infer<typeof colorSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`color/${colorID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getColors(); // Refresh colors after update
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
          <DialogTitle>{t("UpdateColor")}</DialogTitle>
        </DialogHeader>
        <ColorForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="color">
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
