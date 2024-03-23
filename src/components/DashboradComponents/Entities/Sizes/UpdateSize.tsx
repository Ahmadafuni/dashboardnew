import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { size, sizeId, updateSizeModal } from "@/store/Sizes.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { SizeSchema } from "@/form_schemas/newSizeSchema.ts";
import SizesDialog from "@/components/DashboradComponents/Entities/Sizes/SizesDialog.tsx";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

type Props = {
  getSizes: () => void;
};

export default function UpdateSize({ getSizes }: Props) {
  const sizeID = useRecoilValue(sizeId);
  const [open, setOpen] = useRecoilState(updateSizeModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentSize = useRecoilValue(size);
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      sizeName: "",
      description: "",
    },
    values: currentSize,
  });

  const onSubmit = async (data: z.infer<typeof SizeSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`size/${sizeID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getSizes(); // Refresh sizes after update
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
          <DialogTitle> {t("UpdateSize")}</DialogTitle>
        </DialogHeader>
        <SizesDialog form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="size">
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
