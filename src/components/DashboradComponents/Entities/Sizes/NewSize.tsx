import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import SizeDialog from "@/components/DashboradComponents/Entities/Sizes/SizesDialog.tsx";
import { newSizeModal } from "@/store/Sizes.ts";
import { SizeSchema } from "@/form_schemas/newSizeSchema.ts";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { z } from "zod";

type Props = {
  getSizes: any;
};

export default function NewSize({ getSizes }: Props) {
  const [open, setOpen] = useRecoilState(newSizeModal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof SizeSchema>>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      sizeName: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SizeSchema>) => {
    setIsLoading(true);
    try {
      const newSize = await axios.post("size", data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newSize.data.message);
      getSizes();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("NewSize")}</DialogTitle>
        </DialogHeader>
        <SizeDialog form={form} onSubmit={onSubmit} />
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
              t("Add")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
