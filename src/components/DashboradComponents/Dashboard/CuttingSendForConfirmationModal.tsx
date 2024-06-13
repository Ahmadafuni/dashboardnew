import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { cuttingSendConfirmationSchema } from "@/form_schemas/dashboardSchema";
import {
  currentVariantId,
  cuttingSendConfirmationModal,
} from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  getAllWorks: any;
};
export default function CuttingSendForConfirmationModal({
  getAllWorks,
}: Props) {
  const [open, setOpen] = useRecoilState(cuttingSendConfirmationModal);
  const [isLoading, setIsLoading] = useState(false);
  const variantId = useRecoilValue(currentVariantId);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof cuttingSendConfirmationSchema>>({
    resolver: zodResolver(cuttingSendConfirmationSchema),
    defaultValues: {
      ClothCount: "",
      ClothLength: "",
      ClothWeight: "",
      ClothWidth: "",
      DamagedItem: "0",
      Notes: "",
      QuantityInKg: "",
      QuantityInNum: "",
      ReplacedItemInKG: "",
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof cuttingSendConfirmationSchema>
  ) => {
    setIsLoading(true);
    try {
      const newNote = await axios.post(
        `trackingmodels/sent/cutting/checking/variant/${variantId}`,
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newNote.data.message);
      form.reset();
      getAllWorks();
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
          <DialogTitle> {t("Stop/Continue")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-2"
            id="sent-confirmation"
          >
            <FormField
              control={form.control}
              name="QuantityInKg"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Quantity In Kg")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="QuantityInNum"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Quantity In Number")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="ClothCount"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Cloth Count")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="ClothLength"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Cloth Length")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="ClothWidth"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Cloth Width")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="ClothWeight"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Cloth Weight")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="DamagedItem"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Damaged Item")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="ReplacedItemInKG"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Replaced Item In Kg")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="Notes"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Notes")}
                  field={field}
                />
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="sent-confirmation">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              t("Send")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
